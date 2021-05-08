import AmmOrm, { AssociationModelNameAsToInclude } from 'az-model-manager/core';
import { UserI, AccountLinkI, UserOrganizationI } from '../../amm-schemas/interfaces';
import { sha512gen_salt, crypt } from 'az-authn-kit-v2';
import drawIcon from '~/utils/drawIcon';
import { addInitDataToAccountLink } from './accountLink';

export const createInitialUserSettingsData = () => ([
  {
    type: 'general',
    data: {},
  },
  {
    type: 'preference',
    data: {
      uiTheme: {
        direction: 'ltr',
        paletteType: 'light',
      },
    },
  },
]);

export const createInitialAccountLinks = (username, password) => ([addInitDataToAccountLink({
  provider_id: 'basic',
  provider_user_id: username,
  provider_user_access_info: {
    password: crypt(password, sha512gen_salt()),
  },
})]);

export const createInitialUserData = ({
  id,
  name,
  type,
  privilege = 'user',
  picture,
  data,
  labels,
  accountLinks,
} : any, extraColumns : any = {}) : any => ({
  id,
  name,
  type,
  privilege,
  picture: picture || `data:png;base64,${drawIcon(name).toString('base64')}`,
  data: {
    bio: `I'm ${name}`,
    email: null,
    ...data,
  },
  labels: {
    ...labels,
  },
  accountLinks,
  ordererInfos: [
    // {
    //   name,
    //   mobile: '0987654321',
    //   phone1: '+886987654321',
    //   phone2: '+886223456789',
    //   zipcode: '11031',
    //   address: '台北市市府路一號',
    //   area: 'Taiwan',
    // },
  ],
  recipientInfos: [
    // {
    //   name,
    //   mobile: '0987654321',
    //   phone1: '+886987654321',
    //   phone2: '+886223456789',
    //   zipcode: '11031',
    //   address: '台北市市府路一號',
    //   area: 'Taiwan',
    // },
  ],
  userSettings: createInitialUserSettingsData(),
  ...extraColumns,
});

export const createNewUser = (resourceManager : AmmOrm, {
  username, password, name, privilege = 'user', ...rest
}, extraColumns, transaction) => {
  const User = resourceManager.getSqlzModel<UserI>('user')!;

  return User.create(createInitialUserData({
    ...rest,
    name,
    privilege,
    data: {
      bio: `I'm ${name}`,
      email: username,
    },
    accountLinks: createInitialAccountLinks(username, password || username),
  }, extraColumns), {
    transaction,
  });
};

export const createUser = async (resourceManager : AmmOrm, data = {}) => {
  const transaction = await resourceManager.db.transaction();
  try {
    const User = resourceManager.getSqlzModel<UserI>('user')!;
    const user = await User.create(createInitialUserData(data), {
      transaction,
    });
    await transaction.commit();
    return user;
  } catch (error) {
    await transaction.rollback();
    return Promise.reject(error);
  }
};

export const findUserWithAccountLink = async (resourceManager : AmmOrm, userId) => {
  const User = resourceManager.getSqlzModel<UserI>('user')!;
  const AccountLink = resourceManager.getSqlzModel<AccountLinkI>('accountLink')!;
  // const pp = getAssociationIncludeData('user', 'accountLinks')
  // console.log('pp :', pp);
  return User.findOne({
    where: {
      id: userId,
    },
    include: [{
      model: AccountLink,
      as: 'accountLinks',
    }],
  });
};

export const findUser = async (resourceManager : AmmOrm, userId, includes : AssociationModelNameAsToInclude[] = []) => {
  const User = resourceManager.getSqlzModel<UserI>('user')!;

  return User.findOne({
    where: {
      id: userId,
    },
    include: User.ammIncloud(includes),
  });
};

export const findAllUser = async (resourceManager : AmmOrm, includes : AssociationModelNameAsToInclude[] = []) => {
  const User = resourceManager.getSqlzModel<UserI>('user')!;

  return User.findAll({
    attributes: { exclude: ['picture', /* 'created_at', */ 'updated_at', 'deleted_at'] },
    // attributes: ['id', , 'name', 'labels', /*'picture',*/ 'data'],
    include: User.ammIncloud(includes),
  });
};

export const userCreateMemo = async (resourceManager : AmmOrm, userId, memoData) => {
  const user = await findUser(resourceManager, userId);
  if (!user) {
    return Promise.resolve(new Error('user not found'));
  }
  return user.createMemo({
    data: memoData,
  }, { through: { role: 'owner' } });
};

export const userCreateOrganization = async (resourceManager : AmmOrm, userId, organizationName) => {
  const user = await findUser(resourceManager, userId);
  if (!user) {
    return Promise.resolve(new Error('user not found'));
  }
  return user.createOrganization({
    namw: organizationName,
  }, { through: { role: 'owner' } });
};

export const patchUser = async (resourceManager : AmmOrm, userId, data = {}) => {
  const User = resourceManager.getSqlzModel<UserI>('user')!;
  await User.update(data, {
    where: {
      id: userId,
    },
  });
  return User.findOne({
    where: {
      id: userId,
    },
  });
};


// create project
export const userInstCreateProject = async (
  user, projectName, organization_id, transaction, extras,
) => user.createProject({
  name: projectName,
  data: {},
  organization_id,
  ...extras,
}, { through: { role: 'owner' }, transaction });

export const userCreateProject = async (resourceManager : AmmOrm, userId, projectName, organization_id, transaction, extras) => {
  const User = resourceManager.getSqlzModel<UserI>('user')!;
  const UserOrganization = resourceManager.getSqlzAssociationModel<UserOrganizationI>('userOrganization')!;
  // const Organization = resourceManager.getSqlzModel('organization');

  if (!organization_id) {
    return null;
  }

  const owner = await UserOrganization.findOne({
    where: {
      role: 'owner',
      user_id: userId,
      organization_id,
    },
    transaction,
  });
  if (!owner) {
    return null;
  }
  const user = await User.findOne({
    where: {
      id: userId,
    },
    transaction,
  });
  if (!user) {
    return null;
  }
  const porject = await userInstCreateProject(user, projectName, organization_id, transaction, extras);
  return porject;
};

export const findOrCreateNonregisteredUser = async (
  resourceManager : AmmOrm, provider_user_id, { name, data }, includes = [],
) => {
  const AccountLink = resourceManager.getSqlzModel<AccountLinkI>('accountLink')!;
  const accountLink = await AccountLink.findOne({
    where: {
      provider_id: 'non-registered',
      provider_user_id,
    },
  });
  let userId;
  if (!accountLink) {
    const user = await createUser(resourceManager, {
      name,
      type: 'non-registered',
      privilege: 'user',
      // picture,
      data,
      accountLinks: [{
        provider_id: 'non-registered',
        provider_user_id,
        provider_user_access_info: {
          authMethod: provider_user_id.split(':')[0],
        },
      }],
    });
    userId = user.id;
  } else {
    userId = accountLink.user_id;
  }
  return findUser(resourceManager, userId, includes);
};
