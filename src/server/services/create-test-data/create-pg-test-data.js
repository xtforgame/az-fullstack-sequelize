import Sequelize from 'sequelize';
import {sha512gen_salt, crypt} from 'az-authn-kit';

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
        name: 'admin',
        privilege: 'admin',
        accountLinks: getAccountLinks('admin'),
      })
      .then(() => User.create({
        name: 'world',
        privilege: 'world',
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
