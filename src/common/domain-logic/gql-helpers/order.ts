import { Order } from '../gql-types';
import { ShippingFee } from '../gql-types';

export type ShippingFeeTableMap = { [s: string] : ShippingFee[] };

export const toShippingFeeTableMap = (shippingFee: ShippingFee[]) => {
  const shippingFeeTableMap : ShippingFeeTableMap = {};
  const shippingFeeTables : ShippingFee[][] = [];
  shippingFee.forEach(sf => {
    if (!shippingFeeTableMap[sf.countryCode!]) {
      shippingFeeTableMap[sf.countryCode!] = shippingFeeTableMap[sf.countryCode!] || [];
      shippingFeeTables.push(shippingFeeTableMap[sf.countryCode!]);
    }
    shippingFeeTableMap[sf.countryCode!].push(sf);
  })
  shippingFeeTables.forEach(sft => {
    sft.sort((a, b) => a.weight - b.weight);
  })
  return shippingFeeTableMap;
};

export const calcTotalWeight = (order: Order) => {
  return order.products.reduce((n, p) => {
    if (p.fulfilled && !p.soldout) {
      return n + p.product.weight!;
    }
    return n;
  }, 0);
};

export const calcOriginalPriceAndTotalQuantity = (order: Order) => {
  let totalQuantity = 0;
  const originalPrice = order.products.reduce((n, p) => {
    if (p.fulfilled && !p.soldout) {
      totalQuantity += p.quantity!;
      return n + (p.price! * p.quantity!)
    }
    return n;
  }, 0);
  return {
    totalQuantity,
    originalPrice,
  };
};

export const devide = (dividend : number, divisor : number) => {
  const rawQuotient = dividend / divisor;
  const floatPart = rawQuotient % 1;
  const quotient = rawQuotient - floatPart;
  const remainder = dividend - (quotient * divisor);
  return [quotient, remainder];
}


export const convertGToKg = (g : number) => {
  const [quotient, remainder] = devide(g, 1000);
  return remainder > 500 ? quotient + 1 : quotient + 0.5;
}

export const calcOrderInfo = ((order: Order, shippingFeeTableMap: ShippingFeeTableMap) => {
  const {
    totalQuantity,
    originalPrice,
  } = calcOriginalPriceAndTotalQuantity(order);
  const totalWeight : number = calcTotalWeight(order);

  let shippingFeeCalced = false;
  let shippingWeight = 0;
  let shippingFee = 0;
  if (order.logistics === 'ship') {
    shippingFee = 100;
  } else if (order.logistics === 'outlying') {
    shippingFee = 220;
  } else {
    const estimatedKg = convertGToKg(totalWeight);
    const table = shippingFeeTableMap[order.countryCode!];
    if (table) {
      for (let index = 0; index < table.length; index++) {
        const element = table[index];
        shippingWeight = element.weight;
        shippingFee = element.price!;
        if (element.weight >= estimatedKg) {
          break;
        }
      }
      shippingFeeCalced = true;
    }
  }

  let finalPrice = originalPrice;

  let couponDiscount = 0;
  let campaignDiscount = 0;
  // finalPrice -= totalDiscount;
  finalPrice += shippingFee;
  if (order.couponRecord[0]) {
    couponDiscount = order.couponRecord[0].price!;
    finalPrice -= couponDiscount;
  }
  if (order.campaigns[0]) {
    campaignDiscount = order.campaigns[0]?.campaign?.data?.discount?.disconutPrice;
    finalPrice -= campaignDiscount;
  }

  return {
    originalPrice,
    totalQuantity,
    totalWeight,
    totalDiscount: order.metadata.totalDiscount || 0,
    shippingFeeCalced,
    shippingWeight,
    shippingFee,

    finalPrice,
    couponDiscount,
    campaignDiscount,
  };
});

export type ReturnType<T> = T extends (...args: infer U) => infer R ? R: never;


export type OrderInfo = ReturnType<typeof calcOrderInfo>;
