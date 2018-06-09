import Sequelize from 'sequelize';
import {
  toSeqPromise,
} from 'common/utils';
import {sha512gen_salt, crypt} from 'az-authn-kit';
import drawIcon from '~/utils/drawIcon';

let getAccountLinks = (username, password) => ([{
  provider_id: 'basic',
  provider_user_id: `${username}@foo.bar`,
  provider_user_access_info: {
    password: crypt(password, sha512gen_salt()),
  },
}]);

const builtInUsers = [
  {
    name: 'Admin',
    username: 'admin',
    privilege: 'admin',
  },
  {
    name: 'TestUser1',
    username: 'test.user.1',
    privilege: 'user',
  },
  {
    name: 'TestUser2',
    username: 'test.user.2',
    privilege: 'user',
  },
];

function createTestUser(resourceManager){
  let User = resourceManager.getSqlzModel('user');
  let sharedDishes = []
  return User.findAll({
    attributes: [[Sequelize.fn('COUNT', Sequelize.col('name')), 'usercount']],
  })
  .then((users) => {
    if(users[0].dataValues.usercount == 0){
      let idCounter = 0;
      return toSeqPromise(builtInUsers, (_, _value) => {
        const { username, password, name, privilege } = _value;
        return User.create({
          id: (++idCounter),
          name,
          privilege,
          picture: `data:png;base64,${drawIcon(name).toString('base64')}`,
          email: `${username}@foo.bar`,
          data: {
            bio: `I'm ${name}`,
          },
          accountLinks: getAccountLinks(username, password || username),
        })
      });
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
