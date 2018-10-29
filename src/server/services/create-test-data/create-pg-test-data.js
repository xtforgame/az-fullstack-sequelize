import Sequelize from 'sequelize';
import {
  toSeqPromise,
} from 'common/utils';
import { sha512gen_salt, crypt } from 'az-authn-kit';
import {
  createInitialUserData,
} from '~/domain-logic';

const getAccountLinks = (username, password) => ([{
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

function createTestUser(resourceManager) {
  const User = resourceManager.getSqlzModel('user');

  return User.findAll({
    attributes: [[Sequelize.fn('COUNT', Sequelize.col('name')), 'usercount']],
  })
  .then((users) => {
    if (users[0].dataValues.usercount == 0) { // eslint-disable-line eqeqeq
      let idCounter = 0;
      return toSeqPromise(builtInUsers, (_, _value) => {
        const {
          username, password, name, privilege,
        } = _value;
        return User.create(createInitialUserData({
          id: (++idCounter),
          name,
          privilege,
          accountLinks: getAccountLinks(username, password || username),
        }));
      });
    }
    return Promise.resolve(null);
  });
}

export default function createPgTestData(resourceManager, ignore = false) {
  if (ignore) {
    return Promise.resolve(true);
  }
  return createTestUser(resourceManager);
}
