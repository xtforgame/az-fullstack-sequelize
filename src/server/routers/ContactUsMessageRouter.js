import {
  // RestfulResponse,
  RestfulError,
} from 'az-restful-helpers';
import {
  findOrCreateNonregisteredUser,
} from '~/domain-logic';
import RouterBase from '../core/router-base';

export default class ContactUsMessageRouter extends RouterBase {
  setupRoutes({ router }) {
    router.post('/api/contactUsMessages', async (ctx, next) => {
      const {
        name,
        email,
      } = ctx.request.body;

      if (!email || !name) {
        return RestfulError.koaThrowWith(ctx, 400, 'Invalid User Data');
      }

      const user = await findOrCreateNonregisteredUser(this.resourceManager, `email:${email}`, { name, data: { email } });
      // hardcoded organization id
      await user.addOrganization('1', { through: { role: 'member' } });
      return ctx.body = user;
    });
  }
}
