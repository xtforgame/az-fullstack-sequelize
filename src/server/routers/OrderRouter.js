/* eslint-disable no-param-reassign */
import {
  // RestfulResponse,
  RestfulError,
} from 'az-restful-helpers';
import {
  findAllOrder,
  createOrder
} from '~/domain-logic';
import RouterBase from '../core/router-base';

export default class OrderRouter extends RouterBase {
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

    router.get('/api/post-orders', this.authKit.koaHelperEx.getIdentity, async (ctx, next) => {
      if (!ctx.local.userSession || !ctx.local.userSession.user_id) {
        return RestfulError.koaThrowWith(ctx, 404, 'User not found');
      }
      return ctx.body = await createOrder(this.resourceManager, ctx.local.userSession.user_id, {
        orderer: {
          name: 'string',
          mobile: 'string',
          phone1: 'string',
          phone2: 'string',
          zipcode: 'string',
          address: 'string',
          area: 'string',
        },
        recipient: {
          name: 'string',
          mobile: 'string',
          phone1: 'string',
          phone2: 'string',
          zipcode: 'string',
          address: 'string',
          area: 'string',
        },
        memo: 'xxxxx',
        data: {},
      });
    });
  }
}
