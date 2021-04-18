import { promiseReduce } from 'common/utils';
import ServiceBase from '../ServiceBase';
// ========================================
import Routers from '~/routers';
import RouterApi from './api';


export default class RouterManager extends ServiceBase {
  static $name = 'routerManager';

  static $type = 'service';

  static $inject = ['httpApp', 'mailer', 'minioApi', 'resourceManager'];

  static $funcDeps = {
    start: ['resourceManager'],
  };

  constructor(httpApp, mailer, minioApi, resourceManager) {
    super();
    this.authKit = resourceManager.authKit;
    this.resourceManager = resourceManager.resourceManager;
    this.mailer = mailer;
    this.minioApi = minioApi;
    this.routerApi = new RouterApi();

    this.routers = Routers
    .map(Router => new Router({
      httpApp,
      mailer: this.mailer,
      minioApi: this.minioApi,
      authKit: this.authKit,
      resourceManager: this.resourceManager,
      routerApi: this.routerApi,
    }));
    this.routers.map(router => router.setupRoutes(httpApp.appConfig));
  }

  onStart() {
  }

  onAllStarted(containerInterface) {
    return promiseReduce(this.routers, (_, router) => router.onAllStarted(containerInterface));
  }

  onDestroy() {
  }
}
