import RouterBase from '../core/router-base';
import {
  RestfulResponse,
  RestfulError,
} from 'az-restful-helpers';
import drawIcon from '~/utils/drawIcon';

export default class UserRouter extends RouterBase {
  findUser(userId) {
    const User = this.resourceManager.getSqlzModel('user');
    return User.findOne({
      where: {
        id: userId,
      },
    });
  }

  setupRoutes({ router }) {
    router.param('userId', (userId, ctx, next) => this.authKit.koaHelper.getIdentity(ctx, next));

    router.get('/api/users/:userId', (ctx, next) => {
      // console.log('ctx.local.userSession :', ctx.local.userSession);

      if(!ctx.local.userSession || !ctx.local.userSession.user_id){
        return RestfulError.koaThrowWith(ctx, 404, 'User not found');
      }
      return this.findUser(ctx.local.userSession.user_id)
      .then(result => {
        ctx.body = result;
      });
    });

    router.post('/api/users', (ctx) => {
      const User = this.resourceManager.getSqlzModel('user');
      const jsonBody = ctx.request.body;
      const alParamsArray = jsonBody.accountLinks || []; // alParamsArray

      if (alParamsArray.length === 0) {
        return RestfulError.koaThrowWith(ctx, 400, 'No account link provided');
      }

      let newUser = null;
      let accountLinkDataArray = null;

      return Promise.all(
        alParamsArray.map(alParams => this.authKit.authProviderManager.getAuthProvider(alParams.auth_type)
          .then(provider => provider.getAlParamsForCreate(alParams))),
        )
        .then((paramsArrayForCreate) => {
          accountLinkDataArray = paramsArrayForCreate;
          return this.resourceManager.db.transaction()
          .then(t =>
            User.create({
              name: jsonBody.name,
              picture: `data:png;base64,${drawIcon(jsonBody.name).toString('base64')}`,
              data: jsonBody.data || {
                bio: `I'm ${jsonBody.name}`,
                email: null,
              },
              privilege: jsonBody.privilege || 'user',
              accountLinks: accountLinkDataArray,
            }, {
              transaction: t,
            })
            .then(user => {
              t.commit();
              const returnData = user.get();
              delete returnData.updated_at;
              delete returnData.created_at;
              delete returnData.deleted_at;
              delete returnData.accountLinks;
              return RestfulResponse.koaResponseWith(ctx, 200, returnData);
            })
            .catch(error =>
              t.rollback()
                .then(() => {
                  if (error.name === 'SequelizeUniqueConstraintError') {
                    return RestfulError.koaThrowWith(ctx, 400, 'Account id has already been taken.');
                  }
                  // console.log('error :', error);
                  return RestfulError.koaThrowWith(ctx, 500, 'Failed to create user.');
                }))
          );
        });
    });

    router.patch('/api/users/:userId', (ctx, next) => {
      if(!ctx.local.userSession || !ctx.local.userSession.user_id){
        return RestfulError.koaThrowWith(ctx, 404, 'User not found');
      }
      const User = this.resourceManager.getSqlzModel('user');
      return User.update(ctx.request.body, {
        where: {
          id: ctx.local.userSession.user_id, 
        },
        returning: true,
      })
      .then(([_, [result]]) => {
        ctx.body = result;
      });
    });
  }
}
