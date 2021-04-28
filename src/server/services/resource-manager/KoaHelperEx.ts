// ========================================
import {
  RestfulResponse,
  RestfulError,
} from 'az-restful-helpers';
import {
  KoaHelper,
} from 'az-authn-kit-v2';

// ========================================
import GuestManager, { CookieManager } from './GuestManager';

export default class KoaHelperEx {
  koaHelper: KoaHelper;

  guestManager: GuestManager;

  loginSessionCookie: CookieManager;
  loginSessionExistCookie: CookieManager;

  constructor(koaHelper: KoaHelper) {
    this.koaHelper = koaHelper;
    this.guestManager = new GuestManager();
    this.loginSessionCookie = new CookieManager('login-session');
    this.loginSessionExistCookie = new CookieManager('login-session-exists');
  }

  authenticate = async (ctx, next) => {
    const session = await this.koaHelper.authenticate(ctx, next);
    if (session && session.token) {
      // const s = this.koaHelper.authCore.verifyToken(session.token, () => {});
      this.loginSessionCookie.set(ctx, session.token);
      this.loginSessionExistCookie.set(ctx, 'true');
    }
    return session;
  }

  authenticate2Core = (ctx, next) => {
    if (!ctx.request.body || !ctx.request.body.user || !ctx.request.body.user.email || !ctx.request.body.user.password) {
      RestfulError.koaThrowWith(ctx, 400, 'BadRequest');
    }
    const {
      email,
      password,
    } = ctx.request.body.user;
    const json = {
      auth_type: 'basic',
      username: email,
      password,
    };
    return this.koaHelper.authProviderManager.getAuthProvider(json.auth_type)
      .then(provider => provider.authenticate(json))
      .then((account) => {
        const { provider_user_access_info } = account;
        delete account.provider_user_access_info; // eslint-disable-line no-param-reassign
        const { info: sessionInfo, payload: jwtPayload } = this.koaHelper.authCore.createSession(account);
        if (provider_user_access_info.access_token) {
          sessionInfo.access_token = provider_user_access_info.access_token;
        }

        ctx.local = ctx.local || {};
        ctx.local.authData = {
          account,
          jwtPayload,
          sessionInfo,
        };

        return (ctx.body = {
          ...sessionInfo,
          jwtPayload,
        });
      })
      .catch((error) => {
        if (error.status === 401) {
          return RestfulResponse.koaResponseWith(ctx, 200, { error: error.message });
        }
        if (error instanceof RestfulError) {
          return error.koaThrow(ctx);
        }
        throw error;
      });
  };

  authenticate2 = async (ctx, next) => {
    const session = await this.authenticate2Core(ctx, next);
    if (session && session.token) {
      // const s = this.koaHelper.authCore.verifyToken(session.token, () => {});
      this.loginSessionCookie.set(ctx, session.token);
      this.loginSessionExistCookie.set(ctx, 'true');
    }
    return session;
  }

  getIdentity = (ctx, next) => {
    this.koaHelper._ensureLocal(ctx);

    if (ctx.local.userSession) {
      return next();
    }
    ctx.local.userSession = this.koaHelper.authCore.verifyAuthorization(ctx.request.headers);
    if (!ctx.local.userSession) {
      const token = this.loginSessionCookie.get(ctx);
      if (token) {
        ctx.local.userSession = this.koaHelper.authCore.verifyToken(token, () => {});
      }
    }
    ctx.local.azPreloadedState = {
      ...ctx.local.azPreloadedState,
      session: ctx.local.userSession,
      sessionExists: !!ctx.local.userSession,
    };
    return next();
  }
}
