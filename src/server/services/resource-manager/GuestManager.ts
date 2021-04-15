// ========================================
import {
  KoaHelper,
} from 'az-authn-kit-v2';
import { v4 } from 'uuid';
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
    const data = createData()
    ctx.cookies.set(
      this.cookieName,
      data,
      {
        // domain: 'localhost',
        // path: '/index',
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
        expires: new Date(0),
        httpOnly: false,
        overwrite: true,
      },
    );
  }
}

export class GuestData {
  id: string;

  lastVisit: number;

  data: { [s: string]: any };

  cart: {
    id: string;
    items: any[];
  };

  constructor(id : string) {
    this.id = id;
    this.lastVisit = new Date().getTime();
    this.data = {};
    this.cart = {
      id: '',
      items: [],
    };
  }

  update() {
    this.lastVisit = new Date().getTime();
  }
}

export default class GuestManager {
  guestMap: { [s: string]: GuestData };

  cookieManager: CookieManager;

  constructor() {
    this.guestMap = {};
    this.cookieManager = new CookieManager('guest-id');
  }

  track = async (ctx, next) => {
    this.getGuestData(ctx);
    return next();
  }

  getGuestData = async (ctx) => {
    const id = this.cookieManager.ensure(ctx, () => v4());
    let guestData = this.guestMap[id];
    if (!guestData) {
      guestData = new GuestData(id);
      this.guestMap[id] = guestData;
    }
    ctx.local = ctx.local || {};
    ctx.local.guestData = guestData;
    return guestData;
  }
}
