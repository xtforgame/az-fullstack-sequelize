import RouterBase from '../core/router-base';
import { RestfulError } from 'az-restful-helpers';

export default class UserRouter extends RouterBase {
  findUser(userId) {
    this.users = this.resourceManager.getModel('users');
    return this.users.findOne({
      options: {
        submodels: [],
      },
      originalOptions: {
        where: {
          id: userId,
        },
      },
    });
  }

  setupRoutes({ router }) {
    router.param('userId', (userId, ctx, next) => this.authKit.koaHelper.getIdentity(ctx, next));

    router.get('/api/users/:userId', (ctx, next) => {
      // console.log('ctx.local.userSession :', ctx.local.userSession);

      if(!ctx.local.userSession || !ctx.local.userSession.userid){
        return RestfulError.koaThrowWith(ctx, 404, 'User not found');
      }
      return this.findUser(ctx.local.userSession.userid)
      .then(queryResult => {
        const result = queryResult.toPublic();
        // console.log('result :', result);
        ctx.body = result;
      });
    });
  }
}
