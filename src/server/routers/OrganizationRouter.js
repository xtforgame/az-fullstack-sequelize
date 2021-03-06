/* eslint-disable no-param-reassign */
import {
  // RestfulResponse,
  RestfulError,
} from 'az-restful-helpers';
import {
  findUser,
  findOrganizationMembers,
  patchOrganization,
  userCreateOrganization,
  createOrganizationMember,
  patchOrganizationMember,
} from '~/domain-logic';
import RouterBase from '../core/router-base';

export default class OrganizationRouter extends RouterBase {
  setupRoutes({ router }) {
    router.get('/api/organizations', this.authKit.koaHelperEx.getIdentity, async (ctx, next) => {
      // console.log('ctx.local.userSession :', ctx.local.userSession);

      if (!ctx.local.userSession || !ctx.local.userSession.user_id) {
        return RestfulError.koaThrowWith(ctx, 404, 'User not found');
      }
      const user = await findUser(this.resourceManager, ctx.local.userSession.user_id, ['organizations']);
      if (!user) {
        return RestfulError.koaThrowWith(ctx, 404, 'User not found');
      }
      return ctx.body = user.organizations;
    });

    router.post('/api/organizations', this.authKit.koaHelperEx.getIdentity, async (ctx, next) => {
      if (!ctx.local.userSession || !ctx.local.userSession.user_id) {
        RestfulError.koaThrowWith(ctx, 404, 'User not found');
      }

      try {
        const organization = await userCreateOrganization(
          this.resourceManager, ctx.local.userSession.user_id, ctx.request.body.name
        );
        return ctx.body = organization;
      } catch (error) {
        return RestfulError.koaThrowWith(ctx, 404, 'User not found');
      }
    });

    router.patch('/api/organizations/:organizationId', this.authKit.koaHelperEx.getIdentity, async (ctx, next) => {
      if (!ctx.local.userSession || !ctx.local.userSession.user_id) {
        return RestfulError.koaThrowWith(ctx, 404, 'User not found');
      }
      const organization = await patchOrganization(this.resourceManager, ctx.params.organizationId, ctx.request.body);
      return ctx.body = organization;
    });

    router.get('/api/organizations/:organizationId/members', this.authKit.koaHelperEx.getIdentity, async (ctx, next) => {
      if (!ctx.local.userSession || !ctx.local.userSession.user_id) {
        return RestfulError.koaThrowWith(ctx, 404, 'User not found');
      }

      const members = await findOrganizationMembers(
        this.resourceManager, ctx.local.userSession.user_id, ctx.params.organizationId
      );
      if (!members) {
        return RestfulError.koaThrowWith(ctx, 404, 'Organization not found');
      }
      return ctx.body = members;
    });

    router.post('/api/organizations/:organizationId/members', this.authKit.koaHelperEx.getIdentity, async (ctx, next) => {
      if (!ctx.local.userSession || !ctx.local.userSession.user_id) {
        return RestfulError.koaThrowWith(ctx, 404, 'User not found');
      }

      const {
        username,
        password,
        name,
        disabled,
      } = ctx.request.body;

      if (!username || !password || !name) {
        return RestfulError.koaThrowWith(ctx, 400, 'Wong user');
      }

      const member = await createOrganizationMember(
        this.resourceManager, ctx.local.userSession.user_id, ctx.params.organizationId, {
          username,
          password,
          name,
          disabled,
          privilege: 'user',
        }
      );
      const u = await findUser(this.resourceManager, member.id, ['organizations']);
      const user = u.get();
      user.userOrganization = user.organizations.find(o => o.id === ctx.params.organizationId).userOrganization;
      delete user.organizations;
      return ctx.body = user;
    });

    router.patch('/api/organizations/:organizationId/members/:memberId', this.authKit.koaHelperEx.getIdentity, async (ctx, next) => {
      if (!ctx.local.userSession || !ctx.local.userSession.user_id) {
        return RestfulError.koaThrowWith(ctx, 404, 'User not found');
      }

      const member = await patchOrganizationMember(
        this.resourceManager,
        ctx.local.userSession.user_id,
        ctx.params.organizationId,
        ctx.params.memberId,
        ctx.request.body,
      );
      if (!member) {
        return RestfulError.koaThrowWith(ctx, 404, 'Organization not found');
      }
      const u = await findUser(this.resourceManager, ctx.params.memberId, ['organizations']);
      const user = u.get();
      user.userOrganization = user.organizations.find(o => o.id === ctx.params.organizationId).userOrganization;
      delete user.organizations;
      return ctx.body = user;
    });
  }
}
