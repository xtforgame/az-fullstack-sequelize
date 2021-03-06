import {
  // RestfulResponse,
  RestfulError,
} from 'az-restful-helpers';
import {
  findUser,
  userCreateMemo,
  patchMemo,
} from '~/domain-logic';
import RouterBase from '../core/router-base';

export default class MemoRouter extends RouterBase {
  setupRoutes({ router }) {
    router.get('/api/memos', this.authKit.koaHelperEx.getIdentity, async (ctx, next) => {
      // console.log('ctx.local.user.userSettings :', ctx.local.user.userSettings);
      if (!ctx.local.userSession || !ctx.local.userSession.user_id) {
        RestfulError.koaThrowWith(ctx, 404, 'User not found');
      }

      const user = await findUser(this.resourceManager, ctx.local.userSession.user_id, ['memos'/* , 'memos.users' */]);
      if (!user) {
        return RestfulError.koaThrowWith(ctx, 404, 'User not found');
      }
      return ctx.body = user.memos;
    });

    router.post('/api/memos', this.authKit.koaHelperEx.getIdentity, async (ctx, next) => {
      if (!ctx.local.userSession || !ctx.local.userSession.user_id) {
        RestfulError.koaThrowWith(ctx, 404, 'User not found');
      }

      try {
        const memo = await userCreateMemo(this.resourceManager, ctx.local.userSession.user_id, ctx.request.body);
        return ctx.body = memo;
      } catch (error) {
        return RestfulError.koaThrowWith(ctx, 404, 'User not found');
      }
    });

    router.patch('/api/memos/:memoId', this.authKit.koaHelperEx.getIdentity, async (ctx, next) => {
      if (!ctx.local.userSession || !ctx.local.userSession.user_id) {
        return RestfulError.koaThrowWith(ctx, 404, 'User not found');
      }
      const memo = await patchMemo(this.resourceManager, ctx.params.memoId, ctx.request.body);
      return ctx.body = memo;
    });
  }
}
