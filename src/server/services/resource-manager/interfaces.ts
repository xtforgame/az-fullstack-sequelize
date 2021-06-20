import {
  AuthCore,
  AuthProviderManager,
  KoaHelper,
  BasicProvider,
} from 'az-authn-kit-v2';
import SequelizeStore from './SequelizeStore';
import KoaHelperEx from './KoaHelperEx';

// ========================================

export type AuthKit = {
  authCore: AuthCore;
  sequelizeStore: SequelizeStore;
  authProviderManager: AuthProviderManager;
  koaHelper: KoaHelper;
  koaHelperEx: KoaHelperEx;
};
