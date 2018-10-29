import RouterBase from '../core/router-base';

export default class SessionRouter extends RouterBase {
  setupRoutes({ router }) {
    router.post('/api/sessions', this.authKit.koaHelper.authenticate);
  }
}
