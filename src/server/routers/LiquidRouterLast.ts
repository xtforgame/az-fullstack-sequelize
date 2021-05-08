import {
  findUser,
  findAllUser,
  patchUser,
  createUser,

  findAllProduct,

  findOrderById,
  createOrder,
} from '~/domain-logic';
import LiquidRouterBase from './LiquidRouterBase';

export default class LiquidRouterLast extends LiquidRouterBase {
  setupRoutes({ router }) {
    router.get('*', this.liquidFor({}));
  }
}
