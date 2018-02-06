import Azldi from 'azldi';
import { httpPort, httpsPort } from './core/config';
// ============================================
import EnvCfg from './services/env-cfg';
import HttpApp from './services/http-app';
import SequelizeDb from './services/sequelize-db';
import ResourceManager from './services/resource-manager';
import CreateTestData from './services/create-test-data';
import RouterManager from './services/router-manager';
import {
  runningMode,
} from './common/core/config';

const ioc = new Azldi();
ioc.register([
  EnvCfg,
  HttpApp,
  SequelizeDb,
  ResourceManager,
  CreateTestData,
  RouterManager,
]);

ioc.digest();

ioc.runAsync('start')
  .then(() => {
    console.log(`======= Running in the ${runningMode} mode =======`);
    console.log(`Express listening on http port ${httpPort}`);
    console.log(`Express listening on https port ${httpsPort}`);
  })
  .catch((error) => {
    console.log(error);
  });
