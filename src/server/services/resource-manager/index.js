import ServiceBase from '../ServiceBase';
// ========================================
import AsuOrm from 'az-sequelize-utils';
import Azldi from 'azldi';
import {
  AuthCore,
  SequelizeStore,
  AuthProviderManager,
  KoaHelper,
  BasicProvider,
} from 'az-authn-kit';

import createAsuModelDefs from '../../asu-model';
// ========================================

export default class ResourceManager extends ServiceBase {
  static $name = 'resourceManager';
  static $type = 'service';
  static $inject = ['envCfg', 'sequelizeDb'];

  constructor(envCfg, sequelizeDb) {
    super();
    this.jwtSecrets = envCfg.jwtSecrets;
    this.database = sequelizeDb.database;

    this.authKit = new Azldi();
    this.authKit.register([
      AuthProviderManager,
      SequelizeStore,
      AuthCore,
      KoaHelper,
    ]);

    let digestIndex = 0;

    let results = this.authKit.digest({
      onCreate: (obj) => {},
      appendArgs: {
        authCore: [this.jwtSecrets, { algorithm: 'RS256' }],
        sequelizeStore: [{}],
        authProviderManager: [
          {
            basic: {
              provider: BasicProvider,
            },
          },
          {},
        ],
      },
    });
    // this.resourceManager.tableInfo['users'].table.addHook('beforeSync', 'hx', (options) => {
    //   // console.log('beforeSync', options);
    //   this.resourceManager.tableInfo['users'].table.removeHook('beforeSync', 'hx');
    // });

    let sequelizeStore = this.authKit.get('sequelizeStore');
    this.resourceManager = new AsuOrm(this.database, createAsuModelDefs(sequelizeStore));
  }

  onStart() {
    return this.authKit.runAsync('init', [], {
      appendArgs: {
        sequelizeStore: [this.resourceManager],
      },
    });
  }
}
