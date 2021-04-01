// ========================================
import fs from 'fs';
import path from 'path';
import appRootPath from 'app-root-path';
import { Sequelize } from 'sequelize';
import AmmOrm from 'az-model-manager/core';
import { JsonSchemasX } from 'az-model-manager';
import {
  AuthCore,
  AuthProviderManager,
  KoaHelper,
  BasicProvider,
} from 'az-authn-kit-v2';
import {
  jwtIssuer,
} from 'config';
import AuthProviders from './AuthProviders';
import ServiceBase from '../ServiceBase';

import SequelizeStore from './SequelizeStore';

import { getJsonSchema, getJsonSchemasX } from '../../amm-schemas';

import initDatabase from './initDatabase';
import KoaHelperEx from './KoaHelperEx';
import { AuthKit } from './insterfaces';

const liquidRoot = appRootPath.resolve('./node_modules/az-model-manager/liquids');

// ========================================

const logFiles = {};

const write = (file, data) => {
  logFiles[file] = logFiles[file] || fs.createWriteStream(file, { flags: 'w' });
  const logFile = logFiles[file];
  logFile.write(data);
};
export default class ResourceManager extends ServiceBase {
  static $name = 'resourceManager';

  static $type = 'service';

  static $inject = ['envCfg', 'sequelizeDb'];

  static $funcDeps = {
    start: ['sequelizeDb'],
  };

  jwtSecrets : any;
  database : Sequelize;
  jsonSchemasX: JsonSchemasX;
  resourceManager : AmmOrm;
  AuthProviders : any[];
  authKit: AuthKit;

  constructor(envCfg, sequelizeDb) {
    super();
    this.jwtSecrets = envCfg.jwtSecrets;
    this.database = sequelizeDb.database;

    this.AuthProviders = AuthProviders;
    this.authKit = <any>{
      authCore: new AuthCore(this.jwtSecrets, { algorithm: 'RS256', issuer: jwtIssuer }),
      sequelizeStore: new SequelizeStore({}),
      authProviderManager: new AuthProviderManager(
        this.AuthProviders.reduce((m, AuthProvider) => ({
          ...m,
          [AuthProvider.providerId]: {
            provider: AuthProvider,
          },
        }), {}),
        {},
      ),
    };
    this.authKit.koaHelper = new KoaHelper(this.authKit.authCore, this.authKit.authProviderManager);
    this.authKit.koaHelperEx = new KoaHelperEx(this.authKit.koaHelper);

    const jsonSchemaX = new JsonSchemasX('public', <any>getJsonSchema());
    jsonSchemaX.parseRawSchemas();
    jsonSchemaX.buildModelTsFile({
      liquidRoot,
    }).then((tsFile) => {
      write(path.resolve('models.ts'), tsFile);
    });

    this.jsonSchemasX = getJsonSchemasX();
    const ammSchemas = this.jsonSchemasX.toCoreSchemas();
    if (ammSchemas instanceof Error) {
      throw ammSchemas;
    }
    const { schemas } = this.jsonSchemasX
    if (schemas.associationModels!['userUserGroup']) {
      fs.writeFileSync('schemas.json', JSON.stringify(schemas, null, 2), { encoding: 'utf-8' });
    }
    this.resourceManager = new AmmOrm(this.database, ammSchemas);
  }

  onStart() {
    return Promise.all([
      this.authKit.sequelizeStore.setResourceManager(this.resourceManager),
      this.authKit.authProviderManager.setAccountLinkStore(this.authKit.sequelizeStore.getAccountLinkStore()),
    ])
    .then(() => initDatabase(this.resourceManager, false));
  }
}
