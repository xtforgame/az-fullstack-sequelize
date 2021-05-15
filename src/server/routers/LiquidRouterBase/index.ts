import fs from 'fs';
import sass from 'sass';
import axios from 'axios';
import { hasuraEndpoint } from 'common/config';
import {
  toCamel,
  toUnderscore,
  capitalizeFirstLetter,
} from 'common/utils';
import { externalUrl } from 'config';
import mime from 'mime-types';
import { Liquid } from 'liquidjs';
import { buildQueryT1, Options } from 'common/graphQL';
import moment from 'moment';
import RouterBase from '../../core/router-base';
import renderEx from './LiquidRenderEx';

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
  liquidFor = (options : any = {}) => async (ctx, next) => {
    if (ctx.path.startsWith('/azadmin')) {
      return next();
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

    await this.authKit.koaHelperEx.getIdentity(ctx, () => Promise.resolve());
    const userSession = ctx.local.userSession || null;
    // if (ctx.local.userSession && ctx.local.userSession.user_id) {
    //   console.log('ctx.local.userSession.user_id :', ctx.local.userSession.user_id);
    // }
    const guestData = await this.authKit.koaHelperEx.guestManager.getGuestData(ctx);
    const callback = options.callback || (async () => null);
    const getScopeData = options.getScopeData || (async () => ({}));
    const getFilename = options.getFilename || (({ url }) => `pages${url}`);
    let str;
    const url = normalizeUrl(ctx.path);
    const basenameArray = url.substr(0, url.length - '.liquid'.length).split('/');
    const basename = basenameArray[basenameArray.length - 1];
    // console.log('url :', url);
    const cbData = { ctx, url };
    const filename = getFilename(cbData);
    try {
      str = fs.readFileSync(filename, 'utf8');
    } catch (error) {
      if (basename.split('.')[1] === 'css') {
        try {
          str = fs.readFileSync(filename.replace('css.liquid', 'scss.liquid'), 'utf8');
        } catch (error2) {
          return next();
          // fs.writeFileSync('pages' + url, str, { encoding: 'utf8' });
        }
      } else {
        return next();
        // fs.writeFileSync('pages' + url, str, { encoding: 'utf8' });
      }
    }

    const engine = new Liquid({
      root: ['pages'],
    });
    engine.plugin(function (Liquid) {
      this.registerTag('renderEx', renderEx);
      this.registerFilter('toCamel', toCamel);
      this.registerFilter('toUnderscore', toUnderscore);
      this.registerFilter('capitalizeFirstLetter', capitalizeFirstLetter);
      this.registerFilter('debugPrint', (value) => {
        console.log('value :', value);
        return '';
      });
      this.registerFilter('toUnderscoredWcName', s => toUnderscore(s.split('_')[0]));
      this.registerFilter('toWcName', s => s.split('_')[0]);

      this.registerFilter('toCss', (scss) => {
        const result = sass.renderSync({
          data: scss,
        });
        return (result && result.css && result.css.toString('utf8')) || '';
      });

      this.registerFilter('azIf', (condition, y, n) => (condition ? y : n));
      this.registerFilter('dateFormat', (date, format = 'YYYY/MM/DD HH:mm:ss') => moment(date).format(format));

      this.registerFilter('orderStateName', (orderState) => {
        const orderStateNames = {
          unpaid: '未付款',
          paid: '已付款',
          selected: '待出貨',
          shipped: '已出貨',
          returned: '已退貨',
          expired: '已過期',
        };
        return orderStateNames[orderState] || '<未確認>';
      });
    });

    const results = engine.parse(str);
    results.forEach((t) => {
      // console.log('t.token :', t);
    });
    const scope : any = await getScopeData(cbData);
    const buildinScope = {
      userSession,
      productCategories: data.productCategories,
      newUser: !guestData.data.read,
      cart: guestData.cart,
      externalUrl,
    };
    guestData.data.read = true;
    guestData.update();
    const renderTask = engine.render(results, {
      ...buildinScope,
      ...scope,
    });
    // console.log('x :', x.then(console.log));
    const rendered = await renderTask;
    // res.status(404);
    ctx.set('Content-Type', mime.contentType(basename));
    await callback({ ...cbData, rendered });
    return ctx.body = rendered;
  }

  async sendGraphQLRequest(query: string) {
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
