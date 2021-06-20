import fs from 'fs';
import sass from 'sass';
import axios from 'axios';
import { hasuraEndpoint } from 'common/config';
import { externalUrl } from 'config';
import mime from 'mime-types';
import { Liquid } from 'liquidjs';
import { logisticsTypeNameFunc, orderStateNameFunc } from 'common/domain-logic/constants/order';
import { buildQueryT1, GqlResult } from 'common/graphQL';
import moment from 'moment';
import { hasuraAdminSecret } from 'config';
import sendGraphQLRequest from '~/utils/sendGraphQLRequest';
import RouterBase from '../../core/router-base';
import renderEx from './LiquidRenderEx';
import { liquidFor, LiquidForOptions } from './utils';

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
        orderStateName: orderStateNameFunc,
        logisticsTypeName: logisticsTypeNameFunc,
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

      const now = new Date().getTime();
      if (!guestData.lastRead) {
        guestData.lastRead = now;
        guestData.read = false;
      } else if (now - guestData.lastRead > 120000) {
        guestData.lastRead = now;
        guestData.read = false;
      } else {
        guestData.read = true;
      }

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
        newUser: !guestData.read,
        cart: guestData.bs,
        snackbar: guestData.snackbar,
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

  async sendGraphQLRequest<T = any>(query: string, variables?: any) : Promise<GqlResult<T>> {
    return sendGraphQLRequest<T>(query, variables);
  }
}
