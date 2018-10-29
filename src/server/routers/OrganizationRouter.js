import Sequelize from 'sequelize';
import {
  // RestfulResponse,
  RestfulError,
} from 'az-restful-helpers';
import RouterBase from '../core/router-base';

export default class OrganizationRouter extends RouterBase {
  findUser(userId, withOrganization = false) {
    const User = this.resourceManager.getSqlzModel('user');
    const Organization = this.resourceManager.getSqlzModel('organization');

    const extraOptions = withOrganization && {
      include: [{
        model: Organization,
        as: 'organizations',
      }],
    };

    return User.findOne({
      where: {
        id: userId,
      },
      ...extraOptions,
    });
  }

  setupRoutes({ router }) {
    router.get('/api/organizations', this.authKit.koaHelper.getIdentity, (ctx, next) => {
      // console.log('ctx.local.userSession :', ctx.local.userSession);

      if (!ctx.local.userSession || !ctx.local.userSession.user_id) {
        return RestfulError.koaThrowWith(ctx, 404, 'User not found');
      }
      return this.findUser(ctx.local.userSession.user_id, true)
      .then((user) => {
        if (!user) {
          return RestfulError.koaThrowWith(ctx, 404, 'User not found');
        }
        return ctx.body = user.organizations;
      });
    });

    router.post('/api/organizations', this.authKit.koaHelper.getIdentity, (ctx, next) => {
      if (!ctx.local.userSession || !ctx.local.userSession.user_id) {
        return RestfulError.koaThrowWith(ctx, 404, 'User not found');
      }
      return this.findUser(ctx.local.userSession.user_id)
      .then((user) => {
        if (!user) {
          return RestfulError.koaThrowWith(ctx, 404, 'User not found');
        }

        return user.createOrganization({
          name: ctx.request.body.name,
        }, { through: { role: 'owner' } });
      })
      .then((organization) => {
        ctx.body = organization;
      });
    });

    router.patch('/api/organizations/:organizationId', this.authKit.koaHelper.getIdentity, (ctx, next) => {
      if (!ctx.local.userSession || !ctx.local.userSession.user_id) {
        return RestfulError.koaThrowWith(ctx, 404, 'User not found');
      }
      const Organization = this.resourceManager.getSqlzModel('organization');
      return Organization.update({
        data: Sequelize.literal(`data || '${JSON.stringify(ctx.request.body)}'::jsonb`),
      }, {
        where: {
          organization_id: ctx.params.organizationId,
        },
        returning: true,
      })
      .then(([_, [result]]) => {
        ctx.body = result;
      });
    });
  }
}
