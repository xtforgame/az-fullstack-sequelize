import Sequelize from 'sequelize';
import AmmOrm, { AssociationModelNameAsToInclude } from 'az-model-manager/core';
import { ProductGroupI } from '../../amm-schemas/interfaces';

export const findProductGroupById = async (resourceManager : AmmOrm, id : string, includes : AssociationModelNameAsToInclude[] = []) => {
  const ProductGroup = resourceManager.getSqlzModel<ProductGroupI>('productGroup')!;

  return ProductGroup.findOne({
    where: {
      id,
    },
    include: ProductGroup.ammIncloud(includes),
  });
};

export const findAllProductGroup = async (resourceManager : AmmOrm, where, includes : AssociationModelNameAsToInclude[] = []) => {
  const ProductGroup = resourceManager.getSqlzModel<ProductGroupI>('productGroup')!;

  return ProductGroup.findAll({
    where,
    include: ProductGroup.ammIncloud(includes),
    order: [['created_at', 'DESC']],
  });
};

export const createProductGroup = async (resourceManager : AmmOrm, data: any = {}) => {
  const transaction = await resourceManager.db.transaction();
  try {
    const ProductGroup = resourceManager.getSqlzModel<ProductGroupI>('productGroup')!;
    const {
      campaigns,
      ...rest
    } = data;
    const productGroup = await ProductGroup.create({
      ...rest,
    }, {
      transaction,
    });
    await transaction.commit();
    if (productGroup && campaigns) {
      await productGroup.setCampaigns(campaigns);
    }
    return productGroup;
  } catch (error) {
    await transaction.rollback();
    return Promise.reject(error);
  }
};

export const patchProductGroup = async (resourceManager : AmmOrm, productGroupId, data : any = {}) => {
  const ProductGroup = resourceManager.getSqlzModel<ProductGroupI>('productGroup')!;
  const {
    campaigns,
    ...rest
  } = data;
  await ProductGroup.update({
    ...rest,
  }, {
    where: {
      id: productGroupId,
    },
  });
  const productGroup = await ProductGroup.findOne({
    where: {
      id: productGroupId,
    },
  });
  if (productGroup && campaigns) {
    await productGroup.setCampaigns(campaigns);
  }
  return productGroup;
};
