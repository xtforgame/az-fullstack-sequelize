import {
  // RestfulResponse,
  RestfulError,
} from 'az-restful-helpers';
import RouterBase from '../core/router-base';

export default class ProjectRouter extends RouterBase {
  findUser(userId, withProject = false) {
    const User = this.resourceManager.getSqlzModel('user');
    const Project = this.resourceManager.getSqlzModel('project');

    const extraOptions = withProject && {
      include: [{
        model: Project,
        as: 'projects',
      }],
    };

    return User.findOne({
      where: {
        id: userId,
      },
      ...extraOptions,
    });
  }

  findProject(userId, projectId) {
    const UserProject = this.resourceManager.getSqlzAssociationModel('userProject');
    const Project = this.resourceManager.getSqlzModel('project');

    return UserProject.findOne({
      where: {
        user_id: userId,
        project_id: projectId,
      },
    })
    .then((result) => {
      if (!result) {
        return null;
      }
      return Project.findOne({
        where: {
          id: projectId,
        },
      });
    });
  }

  setupRoutes({ router }) {
    router.get('/api/projects', this.authKit.koaHelper.getIdentity, (ctx, next) => {
      // console.log('ctx.local.userSession :', ctx.local.userSession);

      if (!ctx.local.userSession || !ctx.local.userSession.user_id) {
        return RestfulError.koaThrowWith(ctx, 404, 'User not found');
      }
      return this.findUser(ctx.local.userSession.user_id, true)
      .then((user) => {
        if (!user) {
          return RestfulError.koaThrowWith(ctx, 404, 'User not found');
        }
        return ctx.body = user.projects;
      });
    });

    router.get('/api/projects/:projectId', this.authKit.koaHelper.getIdentity, (ctx, next) => {
      // console.log('ctx.local.userSession :', ctx.local.userSession);

      if (!ctx.local.userSession || !ctx.local.userSession.user_id) {
        return RestfulError.koaThrowWith(ctx, 404, 'User not found');
      }

      return this.findProject(ctx.local.userSession.user_id, ctx.params.projectId)
      .then((result) => {
        if (!result) {
          return RestfulError.koaThrowWith(ctx, 404, 'Project not found');
        }
        return ctx.body = result;
      });
    });
  }
}
