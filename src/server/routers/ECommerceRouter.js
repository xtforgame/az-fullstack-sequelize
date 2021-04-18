/* eslint-disable no-param-reassign */
import {
  // RestfulResponse,
  RestfulError,
} from 'az-restful-helpers';
import {
  findAllOrder,

  findAllCampaign,
  createCampaign,
  patchCampaign,

  findAllProductGroup,
  createProductGroup,
  patchProductGroup,


  findAllProduct,
  createProduct,
  patchProduct,
} from '~/domain-logic';
import RouterBase from '../core/router-base';

export default class ECommerceRouter extends RouterBase {
  setupRoutes({ router }) {
    router.get('/api/orders', this.authKit.koaHelperEx.getIdentity, async (ctx, next) => {
      if (!ctx.local.userSession || !ctx.local.userSession.user_id) {
        return RestfulError.koaThrowWith(ctx, 404, 'User not found');
      }
      return ctx.body = await findAllOrder(this.resourceManager, {}, [
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
      const {
        durationType,
        data,
      } = ctx.request.body;
      return ctx.body = await createCampaign(this.resourceManager, {
        ...ctx.request.body,
        durationType: '',
        data: {},
      });
    });

    router.patch('/api/campaigns/:id', this.authKit.koaHelperEx.getIdentity, async (ctx, next) => {
      if (!ctx.local.userSession || !ctx.local.userSession.user_id || ctx.local.userSession.privilege !== 'admin') {
        return RestfulError.koaThrowWith(ctx, 404, 'User not found');
      }
      const {
        durationType,
        data,
        ...rest
      } = ctx.request.body;
      return ctx.body = await patchCampaign(this.resourceManager, ctx.params.id, rest);
    });


    router.post('/api/product-groups', this.authKit.koaHelperEx.getIdentity, async (ctx, next) => {
      if (!ctx.local.userSession || !ctx.local.userSession.user_id || ctx.local.userSession.privilege !== 'admin') {
        return RestfulError.koaThrowWith(ctx, 404, 'User not found');
      }
      const {
        data,
        campaigns,
        ...rest
      } = ctx.request.body;
      return ctx.body = await createProductGroup(this.resourceManager, {
        ...rest,
        data: {},
        campaigns,
      });
    });

    router.patch('/api/product-groups/:id', this.authKit.koaHelperEx.getIdentity, async (ctx, next) => {
      if (!ctx.local.userSession || !ctx.local.userSession.user_id || ctx.local.userSession.privilege !== 'admin') {
        return RestfulError.koaThrowWith(ctx, 404, 'User not found');
      }
      const {
        data,
        ...rest
      } = ctx.request.body;
      return ctx.body = await patchProductGroup(this.resourceManager, ctx.params.id, rest);
    });


    router.post('/api/products', this.authKit.koaHelperEx.getIdentity, async (ctx, next) => {
      if (!ctx.local.userSession || !ctx.local.userSession.user_id || ctx.local.userSession.privilege !== 'admin') {
        return RestfulError.koaThrowWith(ctx, 404, 'User not found');
      }
      const {
        data,
        group,
        ...rest
      } = ctx.request.body;
      return ctx.body = await createProduct(this.resourceManager, {
        ...rest,
        data: {},
        group,
      });
    });

    router.patch('/api/products/:id', this.authKit.koaHelperEx.getIdentity, async (ctx, next) => {
      if (!ctx.local.userSession || !ctx.local.userSession.user_id || ctx.local.userSession.privilege !== 'admin') {
        return RestfulError.koaThrowWith(ctx, 404, 'User not found');
      }
      const {
        data,
        ...rest
      } = ctx.request.body;
      return ctx.body = await patchProduct(this.resourceManager, ctx.params.id, rest);
    });
  }
}
