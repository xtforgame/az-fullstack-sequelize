/* eslint-disable no-console */
import Azldi from 'azldi';
import { httpPort, httpsPort } from 'config';
import {
  runningMode,
} from 'common/config';
// ============================================
import Services from '~/services';

class Server {
  ioc : any;

  constructor() {
    this.ioc = new Azldi();
    this.ioc.register(Services);

    this.ioc.digest();
  }

  start() {
    return this.ioc.runAsync('start')
    .then(() => this.ioc.runAsync('allStarted'));
  }

  destroy() {
    return this.ioc.runAsync('destroy')
      .then((_) => {
        this.ioc = null;
        return _;
      })
      .catch((error) => {
        this.ioc = null;
        return Promise.reject(error);
      });
  }
}

export default Server;
// =============================

const envName = process.env.NODE_ENV ? process.env.NODE_ENV : 'production';

if (envName !== 'test') {
  // start automatically
  const server = new Server();
  server.start()
    .then(() => {
      console.log(`======= Running in the ${runningMode} mode =======`);
      console.log(`Express listening on http port ${httpPort}`);
      console.log(`Express listening on https port ${httpsPort}`);
    })
    .catch((error) => {
      console.log(error);
    });
}
