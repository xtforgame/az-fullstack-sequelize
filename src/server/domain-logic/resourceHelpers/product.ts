import sequelize, { Op } from 'sequelize';
import AmmOrm, { AssociationModelNameAsToInclude } from 'az-model-manager/core';
import { promiseReduce } from 'common/utils';
import { OrderI, ProductI, OrderProductI } from '../../amm-schemas/interfaces';

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

const asignMain = async (resourceManager : AmmOrm, productId: string, orderProduct: OrderProductI, transaction: sequelize.Transaction) => {
  const Product = resourceManager.getSqlzModel<ProductI>('product')!;
  if (orderProduct.quantity! === orderProduct.assignedQuantity!) {
    return;
  }
  const product = await Product.findOne({
    where: {
      id: productId,
    },
    transaction,
  })!;
  if(!product) {
    throw Error('');
  }
  if (product.instock! >= orderProduct.quantity! - orderProduct.assignedQuantity!) {
    product.instock! -= orderProduct.quantity! - orderProduct.assignedQuantity!;
    orderProduct.assignedQuantity! = orderProduct.quantity!;
    orderProduct.fulfilled = true;
  } else if (product.instock! !== 0) {
    product.instock! = 0;
    orderProduct.assignedQuantity! += product.instock!;
  }
  await (<any>product).save({ transaction });
  await (<any>orderProduct).save({ transaction });
}

export const updateFulfilledOrders = async (resourceManager : AmmOrm, transaction: sequelize.Transaction) => {
  const Product = resourceManager.getSqlzModel<ProductI>('product')!;
  const Order = resourceManager.getSqlzModel<OrderI>('order')!;
  const OrderProduct = resourceManager.getSqlzAssociationModel<OrderProductI>('orderProduct')!;

  const orders = await Order.findAll({
    where: {
      // id: {
      //   [Op.in]: orderIds,
      // },
      state: 'paid',
    },
    transaction,
    include: [
      {
        model: Product,
        as: 'products',
      },
    ],
  });

  const fulfilledOrderIds : string[] = [];

  orders.map((o) => {
    const products = o.products!;
    let done = true;
    for (let i = 0; i < products.length; i++) {
      const op = (<OrderProductI>(<any>products[i]).orderProduct);
      if (op.quantity !== op.assignedQuantity) {
        done = false;
        break
      }
    }
    if (done) {
      fulfilledOrderIds.push(o.id);
    }
  });

  await Order.update({
    state: 'selected',
  }, {
    transaction,
    where: {
      id: {
        [Op.in]: fulfilledOrderIds,
      },
    },
  });

  console.log('fulfilledOrderIds :', fulfilledOrderIds);

}

export const assignProduct = async (resourceManager : AmmOrm, productId: any, orderId: any, mode: string) => {
  const Product = resourceManager.getSqlzModel<ProductI>('product')!;
  const OrderProduct = resourceManager.getSqlzAssociationModel<OrderProductI>('orderProduct')!;
  const transaction = await resourceManager.db.transaction();
  try {
    if (mode === 'all') {
      const orderProducts = await OrderProduct.findAll({
        where: {
          order_id: orderId,
        },
        transaction,
      })!;
      await promiseReduce(orderProducts, async (a, orderProduct) => {
        await asignMain(resourceManager, orderProduct.product_id!, orderProduct, transaction);
      }, null);
    } else {
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
      await asignMain(resourceManager, productId, orderProduct, transaction);
    }
    await updateFulfilledOrders(resourceManager, transaction);
    await transaction.commit();
    return true;
  } catch (error) {
    await transaction.rollback();
    return Promise.reject(error);
  }
};

export const assignAllProduct = async (resourceManager : AmmOrm) => {
  const Product = resourceManager.getSqlzModel<ProductI>('product')!;
  const Order = resourceManager.getSqlzModel<OrderI>('order')!;
  const OrderProduct = resourceManager.getSqlzAssociationModel<OrderProductI>('orderProduct')!;
  const transaction = await resourceManager.db.transaction();
  try {
    const ops = await OrderProduct.findAll({
      transaction,
      where: {
        fulfilled: false,
      },
      include: [
        {
          model: Order,
          as: 'order',
          where: {
            state: 'paid',
          },
        },
        {
          model: Product,
          as: 'product',
          where: {
            instock: {
              [Op.gt]: 0,
            },
          },
        },
      ],
    });
    ops.sort((a, b) => (<any>a.order!.paidAt!) - (<any>b.order!.paidAt!));

    // ops.forEach((op) => {
    //   console.log('op.quantity :', op.quantity);
    //   console.log('op.assignedQuantity :', op.assignedQuantity);
    // });

    const orderIds : string[] = [];

    await promiseReduce(ops, async (_, op) => {
      await asignMain(resourceManager, op.product_id!, op, transaction);
      if (!orderIds.find(id => id === op.order_id) && op.order_id) {
        orderIds.push(op.order_id);
      }
    }, null);

    await updateFulfilledOrders(resourceManager, transaction);
    await transaction.commit();
    return true;
  } catch (error) {
    await transaction.rollback();
    return Promise.reject(error);
  }
};
