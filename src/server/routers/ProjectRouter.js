/* eslint-disable no-param-reassign */
import {
  // RestfulResponse,
  RestfulError,
} from 'az-restful-helpers';
import {
  compareRoles,
} from 'common/domain-logic';
import {
  findUser,
  findProject,
  findProjectMembers,
  patchProjectMember,
  addProjectMember,
  removeProjectMember,
  userCreateProject,
} from '~/domain-logic';
import RouterBase from '../core/router-base';

export default class ProjectRouter extends RouterBase {
  setupRoutes({ router }) {
    router.get('/api/projects', this.authKit.koaHelperEx.getIdentity, async (ctx, next) => {
      if (!ctx.local.userSession || !ctx.local.userSession.user_id) {
        return RestfulError.koaThrowWith(ctx, 404, 'User not found');
      }
      const user = await findUser(this.resourceManager, ctx.local.userSession.user_id, [
        {
          as: 'projects.organization',
          attributes: ['id', 'name'],
        },
      ]);
      if (!user) {
        return RestfulError.koaThrowWith(ctx, 404, 'User not found');
      }
      return ctx.body = user.projects;
    });

    router.post('/api/projects', this.authKit.koaHelperEx.getIdentity, async (ctx, next) => {
      if (!ctx.local.userSession || !ctx.local.userSession.user_id) {
        return RestfulError.koaThrowWith(ctx, 404, 'User not found');
      }

      const project = await userCreateProject(
        this.resourceManager,
        ctx.local.userSession.user_id,
        ctx.request.body.projectName,
        ctx.request.body.organizationId,
      );

      return ctx.body = await findProject(this.resourceManager, ctx.local.userSession.user_id, project.id, [
        {
          as: 'organization',
          attributes: ['id', 'name'],
        },
      ]);
    });

    router.get('/api/projects/:projectId', this.authKit.koaHelperEx.getIdentity, async (ctx, next) => {
      if (!ctx.local.userSession || !ctx.local.userSession.user_id) {
        return RestfulError.koaThrowWith(ctx, 404, 'User not found');
      }

      const project = await findProject(this.resourceManager, ctx.local.userSession.user_id, ctx.params.projectId);
      if (!project) {
        return RestfulError.koaThrowWith(ctx, 404, 'Project not found');
      }
      return ctx.body = project;
    });

    router.get('/api/projects/:projectId/members', this.authKit.koaHelperEx.getIdentity, async (ctx, next) => {
      if (!ctx.local.userSession || !ctx.local.userSession.user_id) {
        return RestfulError.koaThrowWith(ctx, 404, 'User not found');
      }

      const members = await findProjectMembers(
        this.resourceManager, ctx.local.userSession.user_id, ctx.params.projectId
      );
      if (!members) {
        return RestfulError.koaThrowWith(ctx, 404, 'Project not found');
      }
      members.sort((a, b) => compareRoles(a.userProject.role, b.userProject.role));
      return ctx.body = members;
    });

    router.post('/api/projects/:projectId/members', this.authKit.koaHelperEx.getIdentity, async (ctx, next) => {
      if (!ctx.local.userSession || !ctx.local.userSession.user_id) {
        return RestfulError.koaThrowWith(ctx, 404, 'User not found');
      }

      const { memberId, name, disabled } = ctx.request.body;

      await addProjectMember(this.resourceManager, ctx.local.userSession.user_id, ctx.params.projectId, {
        id: memberId,
        name,
        disabled,
        role: 'member',
      });

      return ctx.body = {};
    });

    router.patch('/api/projects/:projectId/members/:memberId', this.authKit.koaHelperEx.getIdentity, async (ctx, next) => {
      if (!ctx.local.userSession || !ctx.local.userSession.user_id) {
        return RestfulError.koaThrowWith(ctx, 404, 'User not found');
      }

      const member = await patchProjectMember(
        this.resourceManager, ctx.local.userSession.user_id, ctx.params.projectId, ctx.params.memberId, ctx.request.body
      );
      if (!member) {
        return RestfulError.koaThrowWith(ctx, 404, 'Project not found');
      }
      const u = await findUser(this.resourceManager, ctx.params.memberId, ['projects']);
      const user = u.get();
      user.userProject = user.projects.find(o => o.id === ctx.params.projectId).userProject;
      delete user.projects;
      return ctx.body = user;
    });

    router.delete('/api/projects/:projectId/members/:memberId', this.authKit.koaHelperEx.getIdentity, async (ctx, next) => {
      if (!ctx.local.userSession || !ctx.local.userSession.user_id) {
        return RestfulError.koaThrowWith(ctx, 404, 'User not found');
      }

      const { memberId } = ctx.params;

      await removeProjectMember(this.resourceManager, ctx.local.userSession.user_id, ctx.params.projectId, memberId);

      return ctx.body = { success: true };
    });
  }
}
