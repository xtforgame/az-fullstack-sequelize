/* eslint-disable no-console, import/no-extraneous-dependencies */
import proxy from 'koa-better-http-proxy';
import fs from 'fs';
import pretty from 'pretty';
import { Liquid } from 'liquidjs';
import sass from 'sass';
import mime from 'mime-types';

export default (app) => {
  const toCamel = str => str.replace(/_([a-z])/g, g => g[1].toUpperCase());
  const toUnderscore = str => str.replace(/([-])/g, '_').replace(/([A-Z])/g, g => `_${g.toLowerCase()}`);
  const capitalizeFirstLetter = str => (str.charAt(0).toUpperCase() + str.slice(1));

  const normalizeUrl = (u) => {
    let url = u.split('?')[0];
    if (url.split('.').length === 1) {
      fs.mkdirSync(`pages${url}`, { recursive: true });
      url += '/index.html';
    }
    url += '.liquid';
    return url;
  };


  const p = proxy('https://rick.cloud', {
    userResDecorator(proxyRes, proxyResData, ctx) {
      // console.log('proxyResData :', proxyResData.toString('utf8'));

      const getFilename = (({ url }) => `pages${url}`);
      let str = proxyResData.toString('utf8');
      str = str.replace(/https:\/\/rick.cloud/g, 'http://localhost:8080');
      const url = normalizeUrl(ctx.url);
      const basenameArray = url.substr(0, url.length - '.liquid'.length).split('/');
      const basename = basenameArray[basenameArray.length - 1];
      if (ctx.url.split('.').length === 1) {
        str = pretty(str);
      }
      const cbData = { ctx, url };
      const filename = getFilename(cbData);
      try {
        str = fs.readFileSync(filename, 'utf8');
      } catch (error) {
        if (basename.split('.')[1] === 'css') {
          try {
            str = fs.readFileSync(filename.replace('css.liquid', 'scss.liquid'), 'utf8');
          } catch (error2) {
            fs.writeFileSync(`pages${url}`, str, { encoding: 'utf8' });
          }
        } else {
          fs.writeFileSync(`pages${url}`, str, { encoding: 'utf8' });
        }
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

        this.registerFilter('toCss', (scss) => {
          const result = sass.renderSync({
            data: scss,
          });
          return (result && result.css && result.css.toString('utf8')) || '';
        });
      });

      const componentMap = {};
      const results2 = engine.parse(str);
      results2.forEach((t) => {
        // console.log('t.token :', t);
      });
      const x = engine.render(results2, {
        jsName: {}, componentMap, schemasMetadata: {}, schemas: {},
      });
      // console.log('x :', x.then(console.log));
      return x.then(data =>
        // res.status(404);
        data);
    },
  });

  app.use((ctx, next) => {
    if (!ctx.url.startsWith('/local/')) {
      return next();
    }
    const getScopeData = (async () => ({}));
    const getFilename = (({ url }) => `pages${url}`);
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
      this.registerFilter('toCss', (scss) => {
        const result = sass.renderSync({
          data: scss,
        });
        return (result && result.css && result.css.toString('utf8')) || '';
      });
    });

    const indexJsFileName = '';

    const componentMap = {};
    const results2 = engine.parse(str);
    results2.forEach((t) => {
      // console.log('t.token :', t);
    });
    const x = engine.render(results2, {
      jsName: { index: indexJsFileName }, componentMap, schemasMetadata: {}, schemas: {},
    });
    ctx.set('Content-Type', mime.contentType(basename));
    // console.log('x :', x.then(console.log));
    return x.then((data) => {
      // res.status(404);
      // res.type('css');
      ctx.body = data;
    })
    .catch((e) => {
      console.log('e :', e);
      ctx.status = 404;
      ctx.body = '';
      // return next();
    });
  });

  app.use((ctx, next) => p(ctx, next));
};
