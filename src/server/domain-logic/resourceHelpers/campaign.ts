import Sequelize from 'sequelize';
import AmmOrm, { AssociationModelNameAsToInclude } from 'az-model-manager/core';
import { CampaignI } from '../../amm-schemas/interfaces';

export const findCampaignById = async (resourceManager : AmmOrm, id : string, includes : AssociationModelNameAsToInclude[] = []) => {
  const Campaign = resourceManager.getSqlzModel<CampaignI>('campaign')!;

  return Campaign.findOne({
    where: {
      id,
    },
    include: Campaign.ammIncloud(includes),
  });
};

export const findAllCampaign = async (resourceManager : AmmOrm, where, includes : AssociationModelNameAsToInclude[] = []) => {
  const Campaign = resourceManager.getSqlzModel<CampaignI>('campaign')!;

  return Campaign.findAll({
    where,
    include: Campaign.ammIncloud(includes),
    order: [['created_at', 'DESC']],
  });
};

export const createCampaign = async (resourceManager : AmmOrm, data = {}) => {
  const transaction = await resourceManager.db.transaction();
  try {
    const Campaign = resourceManager.getSqlzModel<CampaignI>('campaign')!;
    const campaign = await Campaign.create({
      ...data,
    }, {
      transaction,
    });
    await transaction.commit();
    return campaign;
  } catch (error) {
    await transaction.rollback();
    return Promise.reject(error);
  }
};

export const patchCampaign = async (resourceManager : AmmOrm, campaignId, data = {}) => {
  const Campaign = resourceManager.getSqlzModel<CampaignI>('campaign')!;
  await Campaign.update({
    ...data,
  }, {
    where: {
      id: campaignId,
    },
  });
  return Campaign.findOne({
    where: {
      id: campaignId,
    },
  });
};
