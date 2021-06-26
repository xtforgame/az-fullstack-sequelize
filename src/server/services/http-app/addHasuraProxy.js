/* eslint-disable no-console, import/no-extraneous-dependencies */
import proxy from 'koa-better-http-proxy';
import { hasuraEndpoint } from 'common/config';
import { hasuraAdminSecret } from 'config';

export default (app) => {
  const p = proxy(hasuraEndpoint, {
    proxyReqOptDecorator: function(proxyReqOpts, srcReq) {
      proxyReqOpts.headers['x-hasura-admin-secret'] = hasuraAdminSecret;
      return proxyReqOpts;
    }
  });

  app.use((ctx, next) => {
    if (!ctx.url.startsWith('/v1/graphql')) {
      return next();
    }
    return p(ctx, next);
  });

  const p2 = proxy('http://rick.cloud:27010');

  app.use((ctx, next) => {
    if (!ctx.url.startsWith('/wp-content')) {
      return next();
    }
    return p2(ctx, next);
  });

  const p3 = proxy('http://rick.cloud:27010/graphql', {
    proxyReqPathResolver(ctx) {
      return new Promise((resolve, reject) => {
        setTimeout(() => { // simulate async
          const parts = ctx.url.split('?');
          const updatedPath = parts[0].replace(/wp\/v1\/graphql/, 'graphql');
          resolve(updatedPath);
        }, 200);
      });
    },
  });
  app.use((ctx, next) => {
    if (!ctx.url.startsWith('/wp/v1/graphql')) {
      return next();
    }
    return p3(ctx, next);
  });
};
