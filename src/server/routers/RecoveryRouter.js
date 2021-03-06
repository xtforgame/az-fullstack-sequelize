import {
  // RestfulResponse,
  RestfulError,
} from 'az-restful-helpers';
import { externalUrl, sendRecoveryTokenInterval } from 'config';
import {
  findAccountLink,
  getTokenUpdatedTimeFromAccountLink,
  challengeRecoveryTokens,
  resetUserAccessInfo,
  upsertRecoveryToken,
} from '~/domain-logic';
import RouterBase from '../core/router-base';

export default class RecoveryRouter extends RouterBase {
  setupRoutes({ router }) {
    router.post('/api/recoveryTokens', async (ctx, next) => {
      const accountLink = await findAccountLink(this.resourceManager, 'basic', ctx.request.body.username, ['recoveryToken']);
      if (!accountLink) {
        return RestfulError.koaThrowWith(ctx, 404, 'User not found');
      }
      const updatedTime = getTokenUpdatedTimeFromAccountLink(accountLink);
      if (updatedTime) {
        const remainingTime = sendRecoveryTokenInterval - (new Date().getTime() - new Date(updatedTime).getTime());
        if (remainingTime > 0) {
          return RestfulError.koaThrowWith(ctx, 429, { error: 'Too Many Request', remainingTime });
        }
      }
      const rnd = Math.random().toString();
      const tokenInfo = await upsertRecoveryToken(
        this.resourceManager,
        ctx.request.body.type,
        ctx.request.body.username,
        rnd.substr(rnd.length - 7, 6),
        accountLink.id,
      );

      const data = tokenInfo.get();
      this.mailer.sendResetPasswordMail(ctx.request.body.username, `${externalUrl}/#/recovery/${encodeURI(ctx.request.body.username)}/${data.token}`, data.token);

      const nextUpdatedTime = data.updated_at || data.created_at;
      if (nextUpdatedTime) {
        const remainingTime = sendRecoveryTokenInterval - (new Date().getTime() - new Date(nextUpdatedTime).getTime());
        return ctx.body = { remainingTime };
      } else {
        return ctx.body = { remainingTime: 0 };
      }
    });

    router.post('/api/challengeRecoveryTokens', async (ctx, next) => {
      const recoveryInfo = await challengeRecoveryTokens(
        this.resourceManager, ctx.request.body.username, ctx.request.body.token
      );
      ctx.body = { passed: recoveryInfo.passed };
    });

    router.post('/api/resetPasswordRequests', async (ctx, next) => {
      const recoveryInfo = await challengeRecoveryTokens(
        this.resourceManager, ctx.request.body.username, ctx.request.body.token
      );
      if (!recoveryInfo.passed) {
        return ctx.body = { passed: recoveryInfo.passed };
      }

      try {
        const provider = await this.authKit.authProviderManager.getAuthProvider('basic');
        const paramsArrayForCreate = await provider.getAccountLinkParamsForCreate({
          auth_type: 'basic',
          username: ctx.request.body.username,
          password: ctx.request.body.newPassword,
        });

        const {
          provider_user_access_info,
        } = paramsArrayForCreate;

        const passed = await resetUserAccessInfo(
          this.resourceManager, recoveryInfo.accountLink, provider_user_access_info
        );
        ctx.body = { passed };
      } catch (error) {
        ctx.body = { passed: false };
      }
      return ctx.body;
    });
  }
}
