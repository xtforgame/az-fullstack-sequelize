import { Order } from '../gql-types';
import {
  ShippingFee,
  Maybe,
  Scalars,
  Product,
} from '../gql-types';

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

export type OrderLike = {
  isInCart?: boolean;
  metadata?: Order["metadata"];
  countryCode?: Order["countryCode"];
  legacyData?: Order["legacyData"];
  logistics?: Order["logistics"];
  products: {
    data?: Maybe<Scalars['jsonb']>;
    deleted_at?: Maybe<Scalars['timestamptz']>;
    price?: Maybe<Scalars['Int']>;
    product: Product;
    product_id?: Maybe<Scalars['bigint']>;
    quantity?: Maybe<Scalars['Int']>;
    fulfilled?: Maybe<Scalars['Boolean']>;
    soldout?: Maybe<Scalars['Boolean']>;
  }[];
  campaigns?: Order["campaigns"];
  couponRecord?: Order["couponRecord"];
};

export const calcTotalWeight = (order: OrderLike) => {
  return order.products.reduce((n, p) => {
    if (order.isInCart || (p.fulfilled && !p.soldout)) {
      return n + (p.product.weight! * p.quantity!);
    }
    return n;
  }, 0);
};

export const calcOriginalPriceAndTotalQuantity = (order: OrderLike) => {
  let totalQuantity = 0;
  const originalPrice = order.products.reduce((n, p) => {
    if (order.isInCart || (p.fulfilled && !p.soldout)) {
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

export const calcOrderInfo = ((order: OrderLike, shippingFeeTableMap: ShippingFeeTableMap) => {
  const isLegacyData = order?.legacyData?.isLegacyData || false;
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
  if (order.couponRecord?.[0]) {
    couponDiscount = order.couponRecord[0].price!;
    finalPrice -= couponDiscount;
  }
  if (order.campaigns?.[0]) {
    campaignDiscount = order.campaigns[0]?.campaign?.data?.discount?.disconutPrice;
    finalPrice -= campaignDiscount;
  }

  return {
    isLegacyData,
    originalPrice,
    totalQuantity,
    totalWeight,
    totalDiscount: order.metadata?.totalDiscount || 0,
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
