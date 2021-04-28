import Sequelize from 'sequelize';
import AmmOrm, { AssociationModelNameAsToInclude } from 'az-model-manager/core';
import { ProductCategoryI } from '../../amm-schemas/interfaces';

export const findProductCategoryById = async (resourceManager : AmmOrm, id : string, includes : AssociationModelNameAsToInclude[] = []) => {
  const ProductCategory = resourceManager.getSqlzModel<ProductCategoryI>('productCategory')!;

  return ProductCategory.findOne({
    where: {
      id,
    },
    include: ProductCategory.ammIncloud(includes),
  });
};

export const findAllProductCategory = async (resourceManager : AmmOrm, where, includes : AssociationModelNameAsToInclude[] = []) => {
  const ProductCategory = resourceManager.getSqlzModel<ProductCategoryI>('productCategory')!;

  return ProductCategory.findAll({
    where,
    include: ProductCategory.ammIncloud(includes),
    order: [['priority', 'DESC']],
  });
};

export const createProductCategory = async (resourceManager : AmmOrm, data: any = {}) => {
  const transaction = await resourceManager.db.transaction();
  try {
    const ProductCategory = resourceManager.getSqlzModel<ProductCategoryI>('productCategory')!;
    const {
      ...rest
    } = data;
    const productCategory = await ProductCategory.create({
      ...rest,
    }, {
      transaction,
    });
    await transaction.commit();
    return productCategory;
  } catch (error) {
    await transaction.rollback();
    return Promise.reject(error);
  }
};

export const patchProductCategory = async (resourceManager : AmmOrm, productCategoryId, data : any = {}) => {
  const ProductCategory = resourceManager.getSqlzModel<ProductCategoryI>('productCategory')!;
  const {
    ...rest
  } = data;
  await ProductCategory.update({
    ...rest,
  }, {
    where: {
      id: productCategoryId,
    },
  });
  const productCategory = await ProductCategory.findOne({
    where: {
      id: productCategoryId,
    },
  });
  return productCategory;
};
