import fs from 'fs';
import sass from 'sass';
import {
  FilterImplOptions,
} from 'liquidjs';
import {
  toCamel,
  toUnderscore,
  capitalizeFirstLetter,
  leftJustify,
} from 'common/utils';
import { externalUrl } from 'config';
import mime from 'mime-types';
import { Liquid } from 'liquidjs';
import moment from 'moment';
import renderEx from './LiquidRenderEx';

const normalizeUrl = (u) => {
  let urlBase = u.split('?')[0];
  if (urlBase.split('.').length === 1) {
    // fs.mkdirSync(`pages${urlBase}`, { recursive: true });
    urlBase += '/index.html';
  }
  if (urlBase.startsWith('//')) {
    urlBase = urlBase.replace('//', '/');
  }
  return urlBase;
};

export type CallbackData = {
  ctx: any;
  url: string;
  urlBase: string;
  basenameArray: string[];
  basename: string;
  buildinScope: {
    externalUrl: string;
    [s: string]: any;
  },
  [s: string]: any;
}

export type FullCallbackData = CallbackData & {
  rendered: string;
  engine: Liquid;
}

export type LiquidForOptions = {
  runBefore?: (cbData: CallbackData) => any;
  callback?: (cbData: CallbackData & { rendered: string }) => any;
  getScopeData?: (cbData: CallbackData) => { [s: string]: any; };
  getFilename?: (cbData: CallbackData) => string;
  shouldBeIgnored?: (ctx: any) => boolean;
  getLiquidFilters?: (cbData: CallbackData & { engine: Liquid }) => Promise<{
    [s: string]: FilterImplOptions;
  }>,
}

export const liquidFor = (options : LiquidForOptions = {}) => async (ctx, next) => {
  const {
    shouldBeIgnored,
    getLiquidFilters = () => ({}),
    runBefore = (async () => null),
    callback = (async () => null),
    getScopeData = (async () => ({})),
    getFilename = (({ url }) => `pages${url}`),
  } = options;
  if (
    ctx.path.startsWith('/azadmin')
    || ctx.path.startsWith('/pages')
    || (shouldBeIgnored && shouldBeIgnored(ctx))
  ) {
    return next();
  }
  const buildinScope = {
    externalUrl,
  };

  let str;
  const urlBase = normalizeUrl(ctx.path);
  const url = `${urlBase}.liquid`;
  const basenameArray = urlBase.split('/');
  const basename = basenameArray[basenameArray.length - 1];
  // console.log('url :', url);
  const cbData : FullCallbackData = <any>{
    ctx,
    urlBase,
    url,
    basenameArray,
    basename,
    buildinScope,
  };
  await runBefore(cbData);
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
  const extraFilters = await getLiquidFilters(cbData);
  engine.plugin(function (Liquid) {
    cbData.engine = engine;
    this.registerTag('renderEx', renderEx);
    this.registerFilter('toCamel', toCamel);
    this.registerFilter('toUnderscore', toUnderscore);
    this.registerFilter('capitalizeFirstLetter', capitalizeFirstLetter);
    this.registerFilter('leftJustify', leftJustify);
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
    Object.keys(extraFilters).forEach(k => this.registerFilter(k, extraFilters[k]));
  });

  const results = engine.parse(str);
  results.forEach((t) => {
    // console.log('t.token :', t);
  });
  const scope : any = await getScopeData(cbData);
  const renderTask = engine.render(results, {
    ...buildinScope,
    ...scope,
  });
  // console.log('x :', x.then(console.log));
  const rendered = await renderTask;
  // res.status(404);
  ctx.set('Content-Type', mime.contentType(basename));
  cbData.rendered = rendered;
  await callback(cbData);
  return ctx.body = rendered;
}
