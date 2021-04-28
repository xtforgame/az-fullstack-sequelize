import {
  RestfulResponse,
  RestfulError,
} from 'az-restful-helpers';
import { isValidEmail } from 'common/utils/validators';
import fs from 'fs';
import sass from 'sass';
import {
  toCamel,
  toUnderscore,
  capitalizeFirstLetter,
} from 'common/utils';
import { externalUrl } from 'config';
import mime from 'mime-types';
import { Liquid } from 'liquidjs';
import {
  findUser,
  findAllUser,
  patchUser,
  createUser,

  findOrderById,
  createOrder,
} from '~/domain-logic';
import RouterBase from '../core/router-base';

const normalizeUrl = (u) => {
  let url = u.split('?')[0];
  if (url.split('.').length === 1) {
    fs.mkdirSync(`pages${url}`, { recursive: true });
    url += '/index.html';
  }
  url += '.liquid';
  if (url.startsWith('//')) {
    url = url.replace('//', '/');
  }
  return url;
};

export default class LiquidRouter extends RouterBase {
  liquidFor = (options = {}) => async (ctx, next) => {
    if (ctx.path.startsWith('/azadmin')) {
      return next();
    }
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
      this.registerFilter('toCamel', toCamel);
      this.registerFilter('toUnderscore', toUnderscore);
      this.registerFilter('capitalizeFirstLetter', capitalizeFirstLetter);
      this.registerFilter('debugPrint', (value) => {
        console.log('value :', value);
        return value;
      });
      this.registerFilter('toUnderscoredWcName', str => toUnderscore(str.split('_')[0]));
      this.registerFilter('toWcName', str => str.split('_')[0]);

      this.registerFilter('toCss', (scss) => {
        const result = sass.renderSync({
          data: scss,
        });
        return (result && result.css && result.css.toString('utf8')) || '';
      });

      this.registerFilter('azIf', (condition, y, n) => (condition ? y : n));
    });

    const componentMap = {};
    const results = engine.parse(str);
    results.forEach((t) => {
      // console.log('t.token :', t);
    });
    const scope = await getScopeData(cbData);
    const buildinScope = {
      userSession,
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

  setupRoutes({ router }) {
    const productListMiddlewares = [async (ctx, next) => {
      ctx.local = ctx.local || {};
      const products = await this.routerApi.getProducts();
      ctx.local.products = products;
      return next();
    }, this.liquidFor({
      getFilename: ({ ctx }) => 'pages/index.html.liquid',
      getScopeData: async ({ ctx }) => ctx.local.products,
    })];

    router.get('/', ...productListMiddlewares);

    const fF = this.liquidFor({
      getFilename: ({ ctx }) => 'pages/products/index.html.liquid',
      getScopeData: async ({ ctx }) => ctx.local.product,
    });
    router.get('/products/:prodId', async (ctx, next) => {
      if (!parseInt(ctx.params.prodId)) {
        return next();
      }
      ctx.local = ctx.local || {};
      const product = await this.routerApi.getProduct(ctx.params.prodId);
      if (!product) {
        return ctx.redirect('/');
      }
      ctx.local.product = product;
      return fF(ctx, next);
    });
    router.get('*', this.liquidFor({}));
  }
}
