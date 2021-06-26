// ========================================
import { Transaction } from 'sequelize';
import {
  KoaHelper,
} from 'az-authn-kit-v2';
import { v4 } from 'uuid';
import { isFunctionV2, Overwrite, promiseReduce } from 'common/utils';
import AmmOrm, { AssociationModelNameAsToInclude } from 'az-model-manager/core';
import { BrowserSessionI, CartProductI } from '~/amm-schemas/interfaces';
import { BrowserSession } from 'common/domain-logic/gql-types';
import { buildQueryT1, Options } from 'common/graphQL';
import sendGraphQLRequest from '~/utils/sendGraphQLRequest';
// ========================================

export class CookieManager {
  cookieName : string;

  constructor(cookieName : string) {
    this.cookieName = cookieName;
  }

  get(ctx) {
    return ctx.cookies.get(this.cookieName);
  }

  ensure(ctx, createData) {
    const data = this.get(ctx);
    if (data) {
      return data;
    }
    return this.set(ctx, createData);
  }

  set(ctx, createData) {
    const data = isFunctionV2(createData) ? createData() : createData;
    ctx.cookies.set(
      this.cookieName,
      data,
      {
        // domain: 'localhost',
        // path: '/index',
        sameSite: 'none',
        // secure: true,
        maxAge: 1000000 * 60 * 1000,
        // expires: new Date('2017-02-15'),
        httpOnly: true,
        overwrite: true,
      },
    );
    return data;
  }

  remove(ctx) {
    ctx.cookies.set(
      this.cookieName,
      '',
      {
        // domain: 'localhost',
        // path: '/index',
        // maxAge: 1000000 * 60 * 1000,
        sameSite: 'none',
        // secure: true,
        expires: new Date(0),
        httpOnly: false,
        overwrite: true,
      },
    );
  }
}

export type SnackbarMessage = {
  text: string;
  done: boolean;
}

export class GuestData {
  resourceManager : AmmOrm;
  bs: BrowserSession;
  snackbar: SnackbarMessage;
  redirectPath: string;

  lastRead: number;
  read: boolean;

  constructor(resourceManager : AmmOrm, bs : BrowserSession) {
    this.resourceManager = resourceManager;
    this.bs = bs;
    this.snackbar = { text: '', done: true };
    this.redirectPath = '';
    this.lastRead = 0;
    this.read = false;
  }

  setData(bs: BrowserSession) {
    this.bs = bs;
  }

  get id() : number {
    return this.bs.id;
  }

  get lastVisit() : number {
    return this.bs.data.lastVisit;
  };

  get data() : any {
    return this.bs.data;
  };

  async clearItem() {
    const BrowserSessionM = this.resourceManager.getSqlzModel<BrowserSessionI>('browserSession')!;
    const browserSession = await BrowserSessionM.findOne({
      where: {
        id: this.bs.id,
      }
    })!;
    await browserSession?.setProducts([]);
  }

  setSnackbar(text: string) {
    this.snackbar.text = text;
    this.snackbar.done = false;
  }

  consumeSnackbar() {
    const { text } = this.snackbar;
    this.snackbar.done = true;
    this.snackbar.text = '';
    return text;
  }

  async addProductQuantityCore(transaction: Transaction, productId: any, price: number, diff: number, quantity: number = 0) {
    const CartProductM = this.resourceManager.getSqlzAssociationModel<CartProductI>('cartProduct')!;
    const cartProduct = await CartProductM.findOne({
      where: {
        cart_id: this.id,
        product_id: productId,
      },
      transaction,
    });
    if (cartProduct) {
      if (!diff) {
        if (cartProduct.quantity! === quantity) {
          return;
        }
        cartProduct.quantity! = quantity;
      } else {
        cartProduct.quantity! += diff;
      }
      if (cartProduct.quantity! <= 0) {
        await cartProduct.destroy({ transaction });
      } else {
        await cartProduct.save({ transaction });
      }
    } else if (diff > 0) {
      await CartProductM.create({
        cart_id: this.id,
        product_id: productId,
        price,
        quantity: diff || quantity,
      }, { transaction });
    }
  }

  async updateProductQuantities(changes : { productId: any, price: number, diff: number, quantity: number }[]) {
    const transaction = await this.resourceManager.db.transaction();
    try {
      await promiseReduce(changes, async (p, { productId, price, quantity }) => {
        await this.addProductQuantityCore(transaction, productId, price, 0, quantity);
      }, null)
      await transaction.commit();
    } catch (error) {
      transaction.rollback();
      return Promise.reject(error);
    }
  }

  async addProductQuantity(productId: any, price: number, diff: number) {
    const transaction = await this.resourceManager.db.transaction();
    const CartProductM = this.resourceManager.getSqlzAssociationModel<CartProductI>('cartProduct')!;

    try {
      await this.addProductQuantityCore(transaction, productId, price, diff);
      await transaction.commit();
    } catch (error) {
      transaction.rollback();
      return Promise.reject(error);
    }
  }

  async removeProduct(productId: any) {
    const CartProductM = this.resourceManager.getSqlzAssociationModel<CartProductI>('cartProduct')!;
    await CartProductM.destroy({
      where: {
        cart_id: this.id,
        product_id: productId,
      },
    });
  }

  async update() {
    this.bs.data.lastVisit = new Date().getTime();
    const BrowserSessionM = this.resourceManager.getSqlzModel<BrowserSessionI>('browserSession')!;
    await BrowserSessionM.update({
      data: this.bs.data,
    }, {
      where: {
        id: this.bs.id,
      }
    })!;
  }
}

export default class GuestManager {
  guestMap: { [s: string]: GuestData };

  cookieManager: CookieManager;

  resourceManager : AmmOrm;

  constructor(resourceManager : AmmOrm) {
    this.guestMap = {};
    this.resourceManager = resourceManager;
    this.cookieManager = new CookieManager('guest-id');
  }

  track = async (ctx, next) => {
    this.getGuestData(ctx);
    return next();
  }

  getGuestData = async (ctx, force : boolean = false) => {
    if (ctx.local?.guestData && !force) {
      return ctx.local?.guestData as GuestData;
    }
    const {
      buildQueryString,
    } = buildQueryT1(
      'browserSessions',
      null,
      `
        id
        sessionId
        data
        products(where: {deleted_at: {_is_null: true}}) {
          quantity
          price
          product {
            id
            customId
            group {
              # products(where: {deleted_at: {_is_null: true}}) {
              #   id
              #   name
              # }
              category {
                id
                name
              }
              campaigns(where: {deleted_at: {_is_null: true}}) {
                campaign {
                  id
                  name
                  type
                  durationType
                  state
                  start
                  end
                  data
                }
              }
              price
            }
            color
            colorName
            size
            name
            price
            weight
            data
            thumbnail
            uid
          }
        }
      `,
      {
        args: ['$sessionId: String!'],
        where: ['{sessionId: {_eq: $sessionId}}'],
        limit: 1,
      },
    );

    const id = this.cookieManager.ensure(ctx, () => v4());
    let { data, errors } = await sendGraphQLRequest<{browserSessions: BrowserSession[]}>(buildQueryString(), {
      sessionId: `${id}`,
    });
    if (!data?.browserSessions?.[0]) {
      const BrowserSessionM = this.resourceManager.getSqlzModel<BrowserSessionI>('browserSession')!;
      await BrowserSessionM.create({
        sessionId: id,
        data: {
          lastVisit: new Date().getTime(),
          redirectPath: '',
          snackbar: {
            text: '',
            done: true,
          },
          cart: {
            id: v4(),
            items: [],
          },
        },
      });
      ({ data, errors } = await sendGraphQLRequest<{browserSessions: BrowserSession[]}>(buildQueryString(), {
        sessionId: id,
      }));
    }
    const guestData : GuestData = this.guestMap[id] || new GuestData(this.resourceManager, data?.browserSessions?.[0]!);
    guestData.setData(data?.browserSessions?.[0]!);
    this.guestMap[id] = guestData;
    ctx.local.guestData = guestData;
    return guestData;
  }
}
