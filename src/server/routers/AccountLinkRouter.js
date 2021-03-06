import {
  // RestfulResponse,
  RestfulError,
} from 'az-restful-helpers';
import {
  updateAccessLink,
} from '~/domain-logic';
import RouterBase from '../core/router-base';

export default class AccountLinkRouter extends RouterBase {
  setupRoutes({ router }) {
    router.patch('/api/users/:userId/accountLinks/basic', async (ctx, next) => {
      await this.authKit.koaHelperEx.ｘ(ctx, next);
      if (ctx.body.error) {
        return RestfulError.koaThrowWith(ctx, 400, 'Wrong Password');
      }

      const {
        username,
        newPassword,
      } = ctx.request.body;

      const accountLinkType = 'basic';

      try {
        const provider = await this.authKit.authProviderManager.getAuthProvider(accountLinkType);
        const paramsArrayForCreate = await provider.getAccountLinkParamsForCreate({
          auth_type: accountLinkType,
          username,
          password: newPassword,
        });

        const {
          provider_user_access_info,
        } = paramsArrayForCreate;

        const passed = await updateAccessLink(
          this.resourceManager,
          accountLinkType,
          username,
          provider_user_access_info,
        );
        return ctx.body = { passed };
      } catch (error) {
        // console.log('error :', error);
        return ctx.body = { passed: false };
      }
    });
  }
}
