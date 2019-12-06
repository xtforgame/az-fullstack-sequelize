import Sequelize from 'sequelize';
import {
  toSeqPromise,
} from 'common/utils';
import { sha512gen_salt, crypt } from 'az-authn-kit';
import {
  createInitialUserData,
} from '~/domain-logic';
import AsuOrm from 'az-sequelize-utils';

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

const createTestUser = async (resourceManager) => {
  const User = resourceManager.getSqlzModel('user');
  const users = await User.findAll({
    attributes: [[Sequelize.fn('COUNT', Sequelize.col('name')), 'usercount']],
  });
  if (users[0].dataValues.usercount != 0) { // eslint-disable-line eqeqeq
    return Promise.resolve(null);
  }

  const transaction = await resourceManager.db.transaction();
  try {
    let idCounter = 0;
    let defaultOrgId;
    let defaultProjId;
    await toSeqPromise(builtInUsers, async (_, _value) => {
      const {
        username, password, name, privilege,
      } = _value;
      const extraColumns = {};
      if (username === 'admin') {
        extraColumns.organizations = [{
          name: 'default',
          [AsuOrm.ThroughValues]: {
            role: 'owner',
          },
        }];
      }
      const user = await User.create(createInitialUserData({
        id: (++idCounter),
        name,
        privilege,
        accountLinks: getAccountLinks(username, password || username),
      }, extraColumns), {
        transaction,
      });
      if (username === 'admin') {
        defaultOrgId = user.organizations[0].id;
        const porject = await user.createProject({
          name: 'default',
          data: {},
          organization_id: defaultOrgId,
        }, { through: { role: 'owner' }, transaction });
        defaultProjId = porject.id;
      } else {
        await user.addOrganization(defaultOrgId, { through: { role: 'user' }, transaction });
        await user.addProject(defaultProjId, { through: { role: 'user' }, transaction });
      }
      return null;
    });
    console.log('defaultOrgId, defaultProjId :', defaultOrgId, defaultProjId);
    await transaction.commit();
  } catch (error) {
    console.log('error :', error);
    await transaction.rollback();
    throw error;
  }
  return null;
};

export default function createPgTestData(resourceManager, ignore = false) {
  if (ignore) {
    return Promise.resolve(true);
  }
  return createTestUser(resourceManager);
}
