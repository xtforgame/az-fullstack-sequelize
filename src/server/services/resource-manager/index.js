import ServiceBase from '../ServiceBase';
// ========================================
import AzRdbmsOrm from 'az-rdbms-orm';
import Azldi from 'azldi';
import {
  AuthCore,
  SequelizeStore,
  AuthProviderManager,
  KoaHelper,
  BasicProvider,
} from 'aro-auth-kit';

import createAroModelDefs from '../../aro-model';
// ========================================

export default class ResourceManager extends ServiceBase {
  static $name = 'resourceManager';
  static $type = 'service';
  static $inject = ['envCfg', 'sequelizeDb'];

  constructor(envCfg, sequelizeDb) {
    super();
    this.credentials = envCfg.credentials;
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
        authCore: [this.credentials.key, {}],
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
    this.resourceManager = new AzRdbmsOrm(this.database, createAroModelDefs(sequelizeStore));
  }

  onStart() {
    return this.authKit.runAsync('init', [], {
      appendArgs: {
        sequelizeStore: [this.resourceManager],
      },
    });
  }
}
