import Sequelize from 'sequelize';
import AmmOrm, { AssociationModelNameAsToInclude } from 'az-model-manager/core';
import { ProductI, OrderProductI } from '../../amm-schemas/interfaces';

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

export const createProduct = async (resourceManager : AmmOrm, data : any = {}) => {
  const transaction = await resourceManager.db.transaction();
  const {
    group,
    ...rest
  } = data;
  try {
    const Product = resourceManager.getSqlzModel<ProductI>('product')!;
    const product = await Product.create({
      ...rest,
    }, {
      transaction,
    });
    await transaction.commit();
    if (product && group) {
      await product.setGroup(group);
    }
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
  console.log('group :', group);
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
    console.log('product, group :', product, group);
    await product.setGroup(group);
  }
  return product;
};


export const assignProduct = async (resourceManager : AmmOrm, productId, orderId) => {
  const Product = resourceManager.getSqlzModel<ProductI>('product')!;
  const OrderProduct = resourceManager.getSqlzAssociationModel<OrderProductI>('orderProduct')!;
  const transaction = await resourceManager.db.transaction();
  try {
    const product = await Product.findOne({
      where: {
        id: productId,
      },
      transaction,
    })!;
    if(!product) {
      throw Error('');
    }
    const orderProduct = await OrderProduct.findOne({
      where: {
        product_id: productId,
        order_id: orderId,
      },
      transaction,
    })!;
    if(!orderProduct) {
      throw Error('');
    }
    if (product.instock! > orderProduct.quantity! - orderProduct.assignedQuantity!) {
      product.instock! -= orderProduct.quantity! - orderProduct.assignedQuantity!;
      orderProduct.assignedQuantity! = orderProduct.quantity!;
    } else if (product.instock! !== 0) {
      product.instock! = 0;
      orderProduct.assignedQuantity! += product.instock!;
    }
    await product.save();
    await orderProduct.save();
    await transaction.commit();
    return product;
  } catch (error) {
    await transaction.rollback();
    return Promise.reject(error);
  }
};
