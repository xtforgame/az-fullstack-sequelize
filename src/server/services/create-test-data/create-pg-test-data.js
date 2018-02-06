import Sequelize from 'sequelize';
import {sha512gen_salt, crypt} from 'aro-auth-kit';

let getUserSubmodels = () => ([
  {
    model: 'accountLinks',
    value: ({parent: {result: user}}) => {
      let username = user.dataValues.name;
      return {
        provider_id: 'basic',
        provider_user_id: username,
        provider_user_access_info: {
          password: crypt(username, sha512gen_salt()),
        },
      };
    },
  },
]);

function createTestUser(resourceManager) {
  let userModel = resourceManager.getModel('users');
  let userGroupModel = resourceManager.getModel('userGroups');
  let sharedDishes = []
  return userModel.table.findAll({
    attributes: [[Sequelize.fn('COUNT', Sequelize.col('id')), 'usercount']],
  })
    .then((users) => {
      if(users[0].dataValues.usercount == 0){
        return userModel.createEx([{
          value: {
            name: 'admin',
            privilege: 'admin',
          },
          submodels: getUserSubmodels(),
        }])
        .then(() => userModel.createEx([{
          value: {
            name: 'world',
            privilege: 'world',
          },
          submodels: getUserSubmodels(),
        }]))
        .then(() => userModel.createEx([{
          value: {
            name: 'user',
            privilege: 'user',
          },
          submodels: getUserSubmodels(),
        }]));
      }
      return Promise.resolve(null);
    });
}

export default function createPgTestData(resourceManager, ignore = false){
  if(ignore){
    return Promise.resolve(true);
  }
  return createTestUser(resourceManager);
}
