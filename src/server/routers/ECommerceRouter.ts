/* eslint-disable no-param-reassign */
import {
  // RestfulResponse,
  RestfulError,
} from 'az-restful-helpers';
import MersenneTwister from 'mersenne-twister';
import {
  findAllOrder,

  findAllCampaign,
  createCampaign,
  patchCampaign,

  findAllProductCategory,
  createProductCategory,
  patchProductCategory,

  findAllProductGroup,
  createProductGroup,
  patchProductGroup,


  findAllProduct,
  createProduct,
  patchProduct,

  assignProduct,
  assignAllProduct,
  releaseProduct,
} from '~/domain-logic';
import RouterBase from '../core/router-base';

const generateId = (seed: number, length: number = 6) => {
  const generator = new MersenneTwister(seed);
  const result : string[] = [];
  const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result.push(characters.charAt(Math.floor(generator.random() * charactersLength)));
  }
  return result.join('');
};

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
        // durationType,
        // data,
      } = ctx.request.body;
      return ctx.body = await createCampaign(this.resourceManager, {
        ...ctx.request.body,
        // durationType: '',
        // data: {},
      });
    });

    router.patch('/api/campaigns/:id', this.authKit.koaHelperEx.getIdentity, async (ctx, next) => {
      if (!ctx.local.userSession || !ctx.local.userSession.user_id || ctx.local.userSession.privilege !== 'admin') {
        return RestfulError.koaThrowWith(ctx, 404, 'User not found');
      }
      const {
        // durationType,
        // data,
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

      const productGroup = await createProductGroup(this.resourceManager, {
        ...rest,
        data: {},
        campaigns,
      });
      productGroup.uid = generateId(parseInt(productGroup.id));
      await productGroup.save();
      return ctx.body = productGroup;
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

    router.post('/api/product-categories', this.authKit.koaHelperEx.getIdentity, async (ctx, next) => {
      if (!ctx.local.userSession || !ctx.local.userSession.user_id || ctx.local.userSession.privilege !== 'admin') {
        return RestfulError.koaThrowWith(ctx, 404, 'User not found');
      }
      const {
        data,
        ...rest
      } = ctx.request.body;
      return ctx.body = await createProductCategory(this.resourceManager, {
        ...rest,
        data: {},
      });
    });

    router.patch('/api/product-categories/:id', this.authKit.koaHelperEx.getIdentity, async (ctx, next) => {
      if (!ctx.local.userSession || !ctx.local.userSession.user_id || ctx.local.userSession.privilege !== 'admin') {
        return RestfulError.koaThrowWith(ctx, 404, 'User not found');
      }
      const {
        data,
        ...rest
      } = ctx.request.body;
      return ctx.body = await patchProductCategory(this.resourceManager, ctx.params.id, rest);
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

      const product = await createProduct(this.resourceManager, {
        ...rest,
        data: {},
        group,
      });
      // product.uid = generateId(parseInt(group));
      // await product.save();
      return ctx.body = product;
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

    router.patch('/api/products/:id/priority', this.authKit.koaHelperEx.getIdentity, async (ctx, next) => {
      if (!ctx.local.userSession || !ctx.local.userSession.user_id || ctx.local.userSession.privilege !== 'admin') {
        return RestfulError.koaThrowWith(ctx, 404, 'User not found');
      }
      const {
        priority,
      } = ctx.request.body;
      if (priority) {
        await patchProduct(this.resourceManager, ctx.params.id, { priority });
        return ctx.body = { priority };
      }
      return ctx.body = { error: '錯誤的排序' };
    });

    router.post('/api/assign-order-product', this.authKit.koaHelperEx.getIdentity, async (ctx, next) => {
      if (!ctx.local.userSession || !ctx.local.userSession.user_id || ctx.local.userSession.privilege !== 'admin') {
        return RestfulError.koaThrowWith(ctx, 404, 'User not found');
      }
      const {
        productId,
        orderId,
        mode,
      } = ctx.request.body;
      return ctx.body = await assignProduct(this.resourceManager, productId, orderId, mode);
    });

    router.post('/api/release-order-product', this.authKit.koaHelperEx.getIdentity, async (ctx, next) => {
      if (!ctx.local.userSession || !ctx.local.userSession.user_id || ctx.local.userSession.privilege !== 'admin') {
        return RestfulError.koaThrowWith(ctx, 404, 'User not found');
      }
      const {
        productId,
        orderId,
        mode,
      } = ctx.request.body;
      return ctx.body = await releaseProduct(this.resourceManager, productId, orderId, mode);
    });

    router.post('/api/assign-all', this.authKit.koaHelperEx.getIdentity, async (ctx, next) => {
      if (!ctx.local.userSession || !ctx.local.userSession.user_id || ctx.local.userSession.privilege !== 'admin') {
        return RestfulError.koaThrowWith(ctx, 404, 'User not found');
      }
      return ctx.body = await assignAllProduct(this.resourceManager);
    });
  }
}
