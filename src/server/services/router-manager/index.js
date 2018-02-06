import ServiceBase from '../ServiceBase';
//========================================
import MainRouter from '../../routers/MainRouter';
import SessionRouter from '../../routers/SessionRouter';

export default class RouterManager extends ServiceBase {
  static $name = 'routerManager';
  static $type = 'service';
  static $inject = ['httpApp', 'resourceManager'];

  constructor(httpApp, resourceManager){
    super();
    this.authKit = resourceManager.authKit;
    this.resourceManager = resourceManager.resourceManager;

    const authKit = {
      authCore: this.authKit.get('authCore'),
      sequelizeStore: this.authKit.get('sequelizeStore'),
      authProviderManager: this.authKit.get('authProviderManager'),
      koaHelper: this.authKit.get('koaHelper'),
    };

    let routers = [MainRouter, SessionRouter]
    .map(Router => new Router({
      authKit,
    }).setupRoutes(httpApp.appConfig));
  }

  onStart(){
  }
}
