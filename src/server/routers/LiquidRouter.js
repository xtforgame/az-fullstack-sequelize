import {
  RestfulResponse,
  RestfulError,
} from 'az-restful-helpers';
import { isValidEmail } from 'common/utils/validators';
import fs from 'fs';
import {
  toCamel,
  toUnderscore,
  capitalizeFirstLetter,
} from 'common/utils';
import mime from 'mime-types';
import { Liquid } from 'liquidjs';
import {
  findUser,
  findAllUser,
  patchUser,
  createUser,
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
    const callback = options.callback || (async () => null);
    const getScopeData = options.getScopeData || (async () => ({}));
    const getFilename = options.getFilename || (({ url }) => `pages${url}`);
    let str;
    const url = normalizeUrl(ctx.path);
    // console.log('url :', url);
    const cbData = { ctx, url };
    try {
      str = fs.readFileSync(getFilename(cbData), 'utf8');
    } catch (error) {
      return next();
      // fs.writeFileSync('pages' + url, str, { encoding: 'utf8' });
    }

    const engine = new Liquid({
      root: 'pages',
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
    });

    const componentMap = {};
    const results2 = engine.parse(str);
    results2.forEach((t) => {
      // console.log('t.token :', t);
    });
    const scope = await getScopeData(cbData);
    const renderTask = engine.render(results2, scope);
    // console.log('x :', x.then(console.log));
    const rendered = await renderTask;
    // res.status(404);
    const basename = url.substr(0, url.length - '.liquid'.length).split('/');
    ctx.set('Content-Type', mime.contentType(basename[basename.length - 1]));
    await callback({ ...cbData, rendered });
    return ctx.body = rendered;
  }

  setupRoutes({ router }) {
    router.get('/products/:prodId', this.liquidFor({
      getFilename: ({ ctx }) => `pages/products${ctx.param.prodId}`,
      getScopeData: async ({ ctx }) => {
        console.log('ctx :', ctx);
      },
    }));
    router.get('*', this.liquidFor({}));
  }
}
