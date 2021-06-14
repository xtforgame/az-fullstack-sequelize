import fs from 'fs';
import sass from 'sass';
import axios from 'axios';
import { hasuraEndpoint } from 'common/config';
import { externalUrl } from 'config';
import mime from 'mime-types';
import { Liquid } from 'liquidjs';
import { buildQueryT1, GqlResult } from 'common/graphQL';
import moment from 'moment';
import RouterBase from '../../core/router-base';
import renderEx from './LiquidRenderEx';
import { liquidFor, LiquidForOptions } from './utils';

const normalizeUrl = (u) => {
  let url = u.split('?')[0];
  if (url.split('.').length === 1) {
    // fs.mkdirSync(`pages${url}`, { recursive: true });
    url += '/index.html';
  }
  url += '.liquid';
  if (url.startsWith('//')) {
    url = url.replace('//', '/');
  }
  return url;
};

export default class LiquidRouterBase extends RouterBase {
  liquidFor = (options : LiquidForOptions = {}) => {
    const {
      shouldBeIgnored,
      getLiquidFilters: glf = () => ({}),
      runBefore: rb = (async () => null),
      callback = (async () => null),
      getScopeData: gsd = (async () => ({})),
      getFilename = (({ url }) => `pages${url}`),
    } = options;

    const runBefore = async (cbData) => {
      await rb(cbData);
    }

    const getLiquidFilters = async (cbData) => {
      const guestData = await this.authKit.koaHelperEx.guestManager.getGuestData(cbData.ctx);
      const filters = await glf(cbData);
      return {
        orderStateName: (orderState) => {
          const orderStateNames = {
            unpaid: '未付款',
            paid: '已付款',
            selected: '待出貨',
            shipped: '已出貨',
            returned: '已退貨',
            expired: '已過期',
          };
          return orderStateNames[orderState] || '<未確認>';
        },
        consumeSnackbar: () => guestData.consumeSnackbar(),
        ...filters,
      };
    }
    
    const getScopeData = async (cbData) => {
      const sd = await gsd(cbData);
      const {
        ctx,
      } = cbData;
      await this.authKit.koaHelperEx.getIdentity(ctx, () => Promise.resolve());
      const userSession = ctx.local.userSession || null;
      // if (ctx.local.userSession && ctx.local.userSession.user_id) {
      //   console.log('ctx.local.userSession.user_id :', ctx.local.userSession.user_id);
      // }
      const guestData = await this.authKit.koaHelperEx.guestManager.getGuestData(ctx);

      guestData.data.read = true;
      guestData.update();

      const {
        buildQueryString,
      } = buildQueryT1(
        'productCategories',
        null,
        `
          id
          name
        `,
        {
          where: ['{active: {_eq: true}}'],
          orderBy: '{priority: desc}',
        }
      );
      const { data } = await this.sendGraphQLRequest(buildQueryString());

      return {
        userSession,
        productCategories: data.productCategories,
        newUser: !guestData.data.read,
        cart: guestData.cart,
        ...sd,
      };
    }

    return liquidFor({
      ...options,
      runBefore,
      getScopeData,
      getLiquidFilters,
    });
  }

  async sendGraphQLRequest<T = any>(query: string) : Promise<GqlResult<T>> {
    const { data } = await axios({
      url: hasuraEndpoint,
      method: 'post',
      headers: {
        'X-Hasura-Role': 'admin',
        'X-Hasura-Admin-Secret': 'xxxxhsr',
        'Content-Type': 'application/json',
      },
      data: {
        query,
      },
    });
    return data;
  }
}
