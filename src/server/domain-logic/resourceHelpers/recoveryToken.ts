import AmmOrm from 'az-model-manager/core';
import { RecoveryTokenI, AccountLinkI } from '../../amm-schemas/interfaces';

export const getTokenUpdatedTimeFromAccountLink = (accountLink) => {
  const token = accountLink.get('recoveryToken');
  if (!token) {
    return token;
  }
  const {
    created_at,
    updated_at,
  } = token.get();
  return updated_at || created_at;
};

export const challengeRecoveryTokens = async (resourceManager : AmmOrm, username, token) => {
  // console.log('ctx.request.body :', ctx.request.body);
  const AccountLink = resourceManager.getSqlzModel<AccountLinkI>('accountLink')!;
  const RecoveryToken = resourceManager.getSqlzModel<RecoveryTokenI>('recoveryToken')!;

  const accountLink = await AccountLink.findOne({
    where: {
      provider_id: 'basic',
      provider_user_id: username,
    },
    include: [{
      model: RecoveryToken,
      as: 'recoveryToken',
    }],
  });
  const recoveryInfo : any = {
    passed: false,
    accountLink,
  };

  if (!accountLink || !accountLink.recoveryToken) {
    return recoveryInfo;
  }

  recoveryInfo.token = accountLink.recoveryToken.get('token');
  recoveryInfo.passed = token === recoveryInfo.token;

  return recoveryInfo;
};

export const resetUserAccessInfo = async (resourceManager : AmmOrm, accountLink, provider_user_access_info) => {
  const transaction = await resourceManager.db.transaction();
  try {
    await accountLink.recoveryToken.destroy({
      transaction,
    });
    await accountLink.update({
      provider_user_access_info,
    }, {
      transaction,
    });

    await transaction.commit();
    return true;
  } catch (error) {
    await transaction.rollback();
    return false;
  }
};

export const upsertRecoveryToken = async (resourceManager : AmmOrm, type, key, token, accountLinkId) => {
  const RecoveryToken = resourceManager.getSqlzModel<RecoveryTokenI>('recoveryToken')!;
  const [tokenInfo] = await RecoveryToken.upsert({
    type,
    key,
    token,
    account_link_id: accountLinkId,
  }, {
    // where: {
    //   account_link_id: accountLinkId,
    // },
    returning: true,
  });
  return tokenInfo;
};
