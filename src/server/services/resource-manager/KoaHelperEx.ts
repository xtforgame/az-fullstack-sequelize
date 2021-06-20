// ========================================
import AmmOrm, { AssociationModelNameAsToInclude } from 'az-model-manager/core';
import {
  RestfulResponse,
  RestfulError,
} from 'az-restful-helpers';
import {
  KoaHelper,
} from 'az-authn-kit-v2';
import {
  findUser,
  findAllUser,
  patchUser,
  createUser,
} from '~/domain-logic';
import { isValidEmail } from 'common/utils/validators';

// ========================================
import GuestManager, { CookieManager } from './GuestManager';

export default class KoaHelperEx {
  koaHelper: KoaHelper;

  guestManager: GuestManager;

  loginSessionCookie: CookieManager;
  loginSessionExistCookie: CookieManager;

  constructor(koaHelper: KoaHelper, resourceManager : AmmOrm) {
    this.koaHelper = koaHelper;
    this.guestManager = new GuestManager(resourceManager);
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

  authenticate3Core = async (ctx, userId, userData) => {
    const json = {
      auth_type: 'facebook',
      userId,
      userData,
      username: userId,
      password: userData,
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

  authenticate3 = async (ctx, userId, userData) => {
    const session = await this.authenticate3Core(ctx, userId, userData);
    if (session && session.token) {
      // const s = this.koaHelper.authCore.verifyToken(session.token, () => {});
      this.loginSessionCookie.set(ctx, session.token);
      this.loginSessionExistCookie.set(ctx, 'true');
    }
    return session;
  }

  createUserEx02 = async (ctx, resourceManager : AmmOrm, userId, userData) => {
    // create only one account per user creation
    const alParamsArray = [{
      auth_type: 'facebook',
      userId,
      userData,
      username: userId,
      password: userData,
    }];

    if (!isValidEmail(alParamsArray[0].userData.email)) {
      return RestfulError.koaThrowWith(ctx, 400, 'Invalid username');
    }

    let accountLinkDataArray : any = null;
    const paramsArrayForCreate = await Promise.all(alParamsArray.map(
      alParams => this.koaHelper.authProviderManager.getAuthProvider(alParams.auth_type)
        .then(provider => provider.getAccountLinkParamsForCreate(alParams))
    ));
    console.log('paramsArrayForCreate :', paramsArrayForCreate);
    accountLinkDataArray = paramsArrayForCreate;
    try {
      const user = await createUser(resourceManager, {
        name: userData.name,
        privilege: 'user',
        accountLinks: accountLinkDataArray,
      });
      const returnData = user.get();
      delete returnData.accountLinks;
      return returnData;
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        return RestfulError.koaThrowWith(ctx, 400, 'Account id has already been taken.');
      }
      // console.log('error :', error);
      return RestfulError.koaThrowWith(ctx, 500, 'Failed to create user.');
    }
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
