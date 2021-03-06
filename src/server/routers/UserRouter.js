import {
  RestfulResponse,
  RestfulError,
} from 'az-restful-helpers';
import { isValidEmail } from 'common/utils/validators';
import {
  findUser,
  findAllUser,
  patchUser,
  createUser,
} from '~/domain-logic';
import RouterBase from '../core/router-base';

export default class UserRouter extends RouterBase {
  setupRoutes({ router }) {
    router.param('userId', (userId, ctx, next) => this.authKit.koaHelperEx.getIdentity(ctx, next));

    router.get('/api/users/:userId', async (ctx, next) => {
      if (!ctx.local.userSession || !ctx.local.userSession.user_id) {
        return RestfulError.koaThrowWith(ctx, 404, 'User not found');
      }
      const user = await findUser(this.resourceManager, ctx.local.userSession.user_id);
      return ctx.body = user;
    });

    router.post('/api/users', async (ctx) => {
      const jsonBody = ctx.request.body;
      let alParamsArray = jsonBody.accountLinks || []; // alParamsArray

      if (alParamsArray.length === 0) {
        return RestfulError.koaThrowWith(ctx, 400, 'No account link provided');
      }

      // create only one account per user creation
      alParamsArray = [alParamsArray[0]];

      if (!isValidEmail(alParamsArray[0].username)) {
        return RestfulError.koaThrowWith(ctx, 400, 'Invalid username');
      }

      let accountLinkDataArray = null;
      const paramsArrayForCreate = await Promise.all(alParamsArray.map(
        alParams => this.authKit.authProviderManager.getAuthProvider(alParams.auth_type)
          .then(provider => provider.getAccountLinkParamsForCreate(alParams))
      ));
      accountLinkDataArray = paramsArrayForCreate;
      try {
        const user = await createUser(this.resourceManager, {
          name: jsonBody.name,
          privilege: 'user',
          accountLinks: accountLinkDataArray,
        });
        const returnData = user.get();
        delete returnData.accountLinks;
        return RestfulResponse.koaResponseWith(ctx, 200, returnData);
      } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
          return RestfulError.koaThrowWith(ctx, 400, 'Account id has already been taken.');
        }
        // console.log('error :', error);
        return RestfulError.koaThrowWith(ctx, 500, 'Failed to create user.');
      }
    });

    router.patch('/api/users/:userId', async (ctx, next) => {
      if (!ctx.local.userSession || !ctx.local.userSession.user_id) {
        return RestfulError.koaThrowWith(ctx, 404, 'User not found');
      }
      const user = await patchUser(this.resourceManager, ctx.local.userSession.user_id, ctx.request.body);
      return ctx.body = user;
    });

    router.get('/api/users', this.authKit.koaHelperEx.getIdentity, async (ctx) => {
      if (!ctx.local.userSession
        || !ctx.local.userSession.user_id
        || ctx.local.userSession.privilege !== 'admin'
      ) {
        return RestfulError.koaThrowWith(ctx, 403, 'Forbidden');
      }

      const users = await findAllUser(this.resourceManager);
      return ctx.body = users;
    });
  }
}
