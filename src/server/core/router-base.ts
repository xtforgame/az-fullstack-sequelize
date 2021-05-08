import AmmOrm from 'az-model-manager/core';
import { AuthKit } from '../services/resource-manager/insterfaces';
import RouterApi from '../services/router-manager/api';



export default class RouterBase {
  httpApp!: any;
  mailer!: any;
  minioApi!: any;
  authKit!: AuthKit;
  resourceManager!: AmmOrm;
  routerApi!: RouterApi;

  constructor(_props) {
    const props = _props || {};
    Object.keys(props).map(name => this[name] = props[name]);
  }

  onAllStarted(containerInterface) {
    return Promise.resolve();
  }
}
