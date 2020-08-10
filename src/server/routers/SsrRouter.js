import app from 'common/app';
import RouterBase from '../core/router-base';
import drawIcon from '~/utils/drawIcon';
import renderer from './renderer';

export default class SsrRouter extends RouterBase {
  setupRoutes({ router }) {
    router.get('/ssr/*', (ctx, next) => {
      ctx.body = renderer(ctx);
    });
  }
}
