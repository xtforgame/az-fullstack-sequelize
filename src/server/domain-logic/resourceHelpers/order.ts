import Sequelize from 'sequelize';
import AmmOrm, { AssociationModelNameAsToInclude } from 'az-model-manager/core';
import { OrderI } from '../../amm-schemas/interfaces';

export const findOrderById = async (resourceManager : AmmOrm, id : string, includes : AssociationModelNameAsToInclude[] = []) => {
  const Order = resourceManager.getSqlzModel<OrderI>('order')!;

  return Order.findOne({
    where: {
      id,
    },
    include: Order.ammIncloud(includes),
  });
};

export const findAllOrder = async (resourceManager : AmmOrm, where, includes : AssociationModelNameAsToInclude[] = []) => {
  const Order = resourceManager.getSqlzModel<OrderI>('order')!;

  return Order.findAll({
    where,
    include: Order.ammIncloud(includes),
    order: [['created_at', 'DESC']],
  });
};

export const createOrder = async (resourceManager : AmmOrm, userId : string, data = {}) => {
  const transaction = await resourceManager.db.transaction();
  try {
    const Order = resourceManager.getSqlzModel<OrderI>('order')!;
    const order = await Order.create({
      user_id: userId,
      ...data,
    }, {
      transaction,
    });
    await transaction.commit();
    return order;
  } catch (error) {
    await transaction.rollback();
    return Promise.reject(error);
  }
};

export const patchOrder = async (resourceManager : AmmOrm, orderId, data = {}) => {
  const Order = resourceManager.getSqlzModel<OrderI>('order')!;
  await Order.update({
    data: Sequelize.literal(`data || '${JSON.stringify(data)}'::jsonb`),
  }, {
    where: {
      id: orderId,
    },
  });
  return Order.findOne({
    where: {
      id: orderId,
    },
  });
};
