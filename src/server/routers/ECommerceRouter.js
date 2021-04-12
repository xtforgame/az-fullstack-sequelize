/* eslint-disable no-param-reassign */
import {
  // RestfulResponse,
  RestfulError,
} from 'az-restful-helpers';
import {
  findAllCampaign,
  createCampaign,
  patchCampaign,
} from '~/domain-logic';
import RouterBase from '../core/router-base';

export default class ECommerceRouter extends RouterBase {
  setupRoutes({ router }) {
    router.get('/api/orders', this.authKit.koaHelperEx.getIdentity, async (ctx, next) => {
      if (!ctx.local.userSession || !ctx.local.userSession.user_id) {
        return RestfulError.koaThrowWith(ctx, 404, 'User not found');
      }
      return ctx.body = await findAllCampaign(this.resourceManager, {}, [
        {
          as: 'user',
          attributes: ['id', 'name'],
        },
      ]);
    });

    router.post('/api/campaigns', this.authKit.koaHelperEx.getIdentity, async (ctx, next) => {
      if (!ctx.local.userSession || !ctx.local.userSession.user_id || ctx.local.userSession.privilege !== 'admin') {
        return RestfulError.koaThrowWith(ctx, 404, 'User not found');
      }
      return ctx.body = await createCampaign(this.resourceManager, ctx.request.body);
    });

    router.patch('/api/campaigns/:id', this.authKit.koaHelperEx.getIdentity, async (ctx, next) => {
      if (!ctx.local.userSession || !ctx.local.userSession.user_id || ctx.local.userSession.privilege !== 'admin') {
        return RestfulError.koaThrowWith(ctx, 404, 'User not found');
      }
      return ctx.body = await patchCampaign(this.resourceManager, ctx.params.id, ctx.request.body);
    });
  }
}
