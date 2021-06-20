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
};
