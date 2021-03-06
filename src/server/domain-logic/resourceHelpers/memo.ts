import Sequelize from 'sequelize';
import AmmOrm from 'az-model-manager/core';
import { MemoI } from '../../amm-schemas/interfaces';

export const patchMemo = async (resourceManager : AmmOrm, memoId, data = {}) => {
  const Memo = resourceManager.getSqlzModel<MemoI>('memo')!;
  await Memo.update({
    data: Sequelize.literal(`data || '${JSON.stringify(data)}'::jsonb`),
  }, {
    where: {
      id: memoId,
    },
  });
  return Memo.findOne({
    where: {
      id: memoId,
    },
  });
};
