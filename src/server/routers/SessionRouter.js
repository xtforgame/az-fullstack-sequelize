import {
  RestfulError,
  RestfulResponse,
} from 'az-restful-helpers';
import RouterBase from '../core/router-base';

export default class SessionRouter extends RouterBase {
  setupRoutes({ router }) {
    router.post('/api/sessions', (ctx, next) => this.authKit.koaHelperEx.authenticate(ctx, next));

    router.delete('/api/sessions/me', this.authKit.koaHelperEx.getIdentity, async (ctx, next) => {
      if (!ctx.local.userSession || !ctx.local.userSession.user_id) {
        return RestfulError.koaThrowWith(ctx, 403, 'Forbidden');
      }
      ctx.cookies.set(
        'login-session',
        '',
        {
          // domain: 'localhost',
          // path: '/index',
          // maxAge: 1000000 * 60 * 1000,
          expires: new Date(0),
          httpOnly: true,
          overwrite: true,
        },
      );
      ctx.cookies.set(
        'login-session-exists',
        '',
        {
          // domain: 'localhost',
          // path: '/index',
          // maxAge: 1000000 * 60 * 1000,
          expires: new Date(0),
          httpOnly: false,
          overwrite: true,
        },
      );
      return true;
    });

    router.get('/api/sessions/me', this.authKit.koaHelperEx.getIdentity, async (ctx, next) => {
      if (!ctx.local.userSession || !ctx.local.userSession.user_id) {
        return RestfulError.koaThrowWith(ctx, 403, 'Forbidden');
      }
      const { userSession } = ctx.local;

      // const user = await findUser(this.resourceManager, userSession.user_id);
      // if (!user || !user.enabled) {
      //   return RestfulError.koaThrowWith(ctx, 403, 'Forbidden');
      // }
      const originalData = {
        user: {
          id: userSession.user_id,
          name: userSession.user_name,
          privilege: userSession.privilege,
        },
        provider_id: userSession.auth_type,
        provider_user_id: userSession.auth_id,
      };

      const { info, payload: jwtPayload } = this.authKit.authCore.createSession(originalData);
      return RestfulResponse.koaResponseWith(ctx, 200, {
        ...info,
        jwtPayload,
      });
    });
  }
}
