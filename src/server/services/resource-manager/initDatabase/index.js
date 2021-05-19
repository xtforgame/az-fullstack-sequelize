import Sequelize from 'sequelize';
import AmmOrm from 'az-model-manager/core';
import {
  toSeqPromise,
} from 'common/utils';
import { hashPassword } from '~/domain-logic/common';
import {
  createInitialUserData,
  addInitDataToAccountLink,
} from '~/domain-logic';


const getAccountLinks = (username, password) => ([addInitDataToAccountLink({
  provider_id: 'basic',
  provider_user_id: username,
  provider_user_access_info: {
    password: hashPassword(password),
  },
  data: {
    confirmed: true,
  },
})]);

const builtInUsers = [
  {
    name: 'Admin',
    username: 'admin@foo.bar',
    password: 'admin',
    privilege: 'admin',
  },
  {
    name: 'TestUser1',
    username: 'test.user.1@foo.bar',
    password: 'test',
    privilege: 'user',
  },
  {
    name: 'TestUser2',
    username: 'test.user.2@foo.bar',
    password: 'test',
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
      if (username === 'admin@foo.bar') {
        extraColumns.organizations = [{
          name: 'default',
          [AmmOrm.ThroughValues]: {
            role: 'owner',
          },
        }, {
          name: 'private',
          [AmmOrm.ThroughValues]: {
            role: 'owner',
          },
        }];
      }
      const user = await User.create(createInitialUserData({
        id: (++idCounter),
        name,
        privilege,
        data: {
          bio: `I'm ${name}`,
          email: username,
        },
        accountLinks: getAccountLinks(username, password || username),
      }, extraColumns), {
        transaction,
      });
      if (username === 'admin@foo.bar') {
        defaultOrgId = user.organizations[0].id;
        const porject = await user.createProject({
          name: 'management',
          data: {},
          organization_id: defaultOrgId,
        }, { through: { role: 'owner' }, transaction });
        defaultProjId = porject.id;
        await user.createProject({
          name: 'management',
          data: {},
          organization_id: user.organizations[1].id,
        }, { through: { role: 'owner' }, transaction });
      } else {
        await user.addOrganization(defaultOrgId, { through: { role: 'member' }, transaction });
        await user.addProject(defaultProjId, { through: { role: 'member' }, transaction });
      }
      return null;
    });
    // console.log('defaultOrgId, defaultProjId :', defaultOrgId, defaultProjId);
    await transaction.commit();
  } catch (error) {
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
