import Sequelize from 'sequelize';
import AmmOrm from 'az-model-manager/core';
import { UserSettingI } from '../../amm-schemas/interfaces';

export const findUserSettings = (resourceManager : AmmOrm, userId) => {
  const UserSetting = resourceManager.getSqlzModel<UserSettingI>('userSetting')!;

  return UserSetting.findAll({
    attributes: { exclude: ['created_at', 'updated_at', 'deleted_at'] },
    where: {
      user_id: userId,
    },
  });
};

export const patchUserSetting = async (resourceManager : AmmOrm, userId, userSettingType, data = {}) => {
  const UserSetting = resourceManager.getSqlzModel<UserSettingI>('userSetting')!;
  await UserSetting.update({
    data: Sequelize.literal(`data || '${JSON.stringify(data)}'::jsonb`),
  }, {
    where: {
      user_id: userId,
      type: userSettingType,
    },
  });
  return UserSetting.findOne({
    where: {
      user_id: userId,
      type: userSettingType,
    },
  });
};
