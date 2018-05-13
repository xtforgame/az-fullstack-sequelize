import Sequelize from 'sequelize';
import {sha512gen_salt, crypt} from 'az-authn-kit';
import drawIcon from '~/utils/drawIcon';

let getAccountLinks = (username) => ([{
  provider_id: 'basic',
  provider_user_id: username,
  provider_user_access_info: {
    password: crypt(username, sha512gen_salt()),
  },
}]);

function createTestUser(resourceManager){
  let User = resourceManager.getSqlzModel('user');
  let sharedDishes = []
  return User.findAll({
    attributes: [[Sequelize.fn('COUNT', Sequelize.col('name')), 'usercount']],
  })
  .then((users) => {
    if(users[0].dataValues.usercount == 0){
      return User.create({
        name: 'Admin',
        privilege: 'admin',
        picture: `data:png;base64,${drawIcon('Admin').toString('base64')}`,
        data: {
          bio: `I'm ${'Admin'}`,
          email: null,
        },
        accountLinks: getAccountLinks('admin'),
      })
      .then(() => User.create({
        name: 'World',
        privilege: 'world',
        picture: `data:png;base64,${drawIcon('World').toString('base64')}`,
        data: {
          bio: `I'm ${'World'}`,
          email: null,
        },
        accountLinks: getAccountLinks('world'),
      }));
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
