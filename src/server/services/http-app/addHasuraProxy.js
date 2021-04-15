/* eslint-disable no-console, import/no-extraneous-dependencies */
import proxy from 'koa-better-http-proxy';
import { hasuraEndpoint } from 'common/config';

export default (app) => {
  const p = proxy(hasuraEndpoint);

  app.use((ctx, next) => {
    if (!ctx.url.startsWith('/v1/graphql')) {
      return next();
    }
    return p(ctx, next);
  });
};
