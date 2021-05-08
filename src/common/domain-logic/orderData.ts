export type Discount = {
  discountType: string;
  campaignId: number;
  applied: boolean;
  fulfilled: boolean;
  data: any;
}

export type ProductListRow = {
  id: number;
  product: any;
  price: number;
  quantity: number;
  discountPrice: number;
  subtotal: number;
  discounts: Discount[];
}


export type UserInfo = {
  name: string;
  mobile: string;
  phone: string;
  country: string;
}

export type BuyerInfo = UserInfo & {
  company: string;
  taxid: string;
  email: string;
}

export type RecipientInfo = UserInfo & {
  birthday: string; // "2012/12/12"
  zipcode: string;
  area: string;
  address: string;
  preferTime: string;
  memo: string;
}

export type NormalizedOrderData = {
  order: {
    logisticsType: string;
    buyer: BuyerInfo;
    recipient: RecipientInfo;
    updateUserRecipientMemo: string;

    // calculated
    shippingFee: number;
    subtotal: number;
  }
  products: ProductListRow[];
}
