import Sequelize from 'sequelize';
import AmmOrm, { AssociationModelNameAsToInclude } from 'az-model-manager/core';
import { ProductI } from '../../amm-schemas/interfaces';

export const findProductById = async (resourceManager : AmmOrm, id : string, includes : AssociationModelNameAsToInclude[] = []) => {
  const Product = resourceManager.getSqlzModel<ProductI>('product')!;

  return Product.findOne({
    where: {
      id,
    },
    include: Product.ammIncloud(includes),
  });
};

export const findAllProduct = async (resourceManager : AmmOrm, where, includes : AssociationModelNameAsToInclude[] = []) => {
  const Product = resourceManager.getSqlzModel<ProductI>('product')!;

  return Product.findAll({
    where,
    include: Product.ammIncloud(includes),
    order: [['created_at', 'DESC']],
  });
};

export const createProduct = async (resourceManager : AmmOrm, data = {}) => {
  const transaction = await resourceManager.db.transaction();
  try {
    const Product = resourceManager.getSqlzModel<ProductI>('product')!;
    const product = await Product.create({
      ...data,
    }, {
      transaction,
    });
    await transaction.commit();
    return product;
  } catch (error) {
    await transaction.rollback();
    return Promise.reject(error);
  }
};

export const patchProduct = async (resourceManager : AmmOrm, productId, data : any = {}) => {
  const Product = resourceManager.getSqlzModel<ProductI>('product')!;
  const {
    group,
    ...rest
  } = data;
  await Product.update({
    ...rest,
  }, {
    where: {
      id: productId,
    },
  });
  const product = await Product.findOne({
    where: {
      id: productId,
    },
  });
  if (product && group) {
    await product.setGroup(group);
  }
  return product;
};
