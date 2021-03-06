import AmmOrm, { AssociationModelNameAsToInclude } from 'az-model-manager/core';
import { AccountLinkI } from '../../amm-schemas/interfaces';

export const addInitDataToAccountLink = (alParams) => ({
  ...alParams,
  data: {
    confirmed: false,
    ...alParams.data,
  },
});

export const createAccountLink = async (resourceManager : AmmOrm, paramsForCreate, userId) => {
  const AccountLink = resourceManager.getSqlzModel<AccountLinkI>('accountLink')!;
  const transaction = await resourceManager.db.transaction();
  try {
    const accountLink = await AccountLink.create(addInitDataToAccountLink({
      ...paramsForCreate,
      user_id: userId,
    }), {
      transaction,
    });
    await transaction.commit();
    return accountLink;
  } catch (error) {
    transaction.rollback();
    return Promise.reject(error);
  }
};

export const updateAccessLink = async (
  resourceManager,
  provider_id,
  provider_user_id,
  provider_user_access_info,
) => {
  const AccountLink = resourceManager.getSqlzModel('accountLink');
  await AccountLink.update({
    provider_user_access_info,
  }, {
    where: {
      provider_id,
      provider_user_id,
    },
  });
  return true;
};

export const findAccountLink = async (resourceManager : AmmOrm, provider_id, provider_user_id, includes : AssociationModelNameAsToInclude[] = []) => {
  const AccountLink = resourceManager.getSqlzModel<AccountLinkI>('accountLink')!;
  return AccountLink.findOne({
    where: {
      provider_id,
      provider_user_id,
    },
    include: AccountLink.ammIncloud(includes),
  });
};
