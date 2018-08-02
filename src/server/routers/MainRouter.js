import RouterBase from '../core/router-base';
import drawIcon from '~/utils/drawIcon';

export default class MainRouter extends RouterBase {
  setupRoutes({ router }) {
    // Get state.
    router.get('/api', (ctx, next) => ctx.body = 'test');

    router.get('/api/icon-test/:seed', (ctx, next) => ctx.body = `
        <html>
          <body>
            <img src="data:png;base64,${
  drawIcon(ctx.params.seed || '').toString('base64')
}" style="border-radius: 50%;" />
          </body>
        </html>
      `);
  }
}
