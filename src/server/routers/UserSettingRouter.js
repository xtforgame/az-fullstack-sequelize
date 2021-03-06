import {
  // RestfulResponse,
  RestfulError,
} from 'az-restful-helpers';
import {
  findUserSettings,
  patchUserSetting,
} from '~/domain-logic';
import RouterBase from '../core/router-base';

export default class UserSettingRouter extends RouterBase {
  setupRoutes({ router }) {
    router.get('/api/userSettings', this.authKit.koaHelperEx.getIdentity, async (ctx, next) => {
      if (!ctx.local.userSession || !ctx.local.userSession.user_id) {
        return RestfulError.koaThrowWith(ctx, 404, 'User not found');
      }
      const userSettings = await findUserSettings(this.resourceManager, ctx.local.userSession.user_id);
      return ctx.body = userSettings;
    });

    router.patch('/api/userSettings/:userSettingType', this.authKit.koaHelperEx.getIdentity, async (ctx, next) => {
      if (!ctx.local.userSession || !ctx.local.userSession.user_id) {
        RestfulError.koaThrowWith(ctx, 404, 'User not found');
      }
      const userSetting = await patchUserSetting(
        this.resourceManager, ctx.local.userSession.user_id, ctx.params.userSettingType, ctx.request.body
      );
      ctx.body = userSetting;
    });
  }
}
