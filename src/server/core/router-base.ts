import AmmOrm from 'az-model-manager/core';
import { AuthKit } from '../services/resource-manager/insterfaces';

export default class RouterBase {
  httpApp!: any;
  mailer!: any;
  minioApi!: any;
  authKit!: AuthKit;
  resourceManager!: AmmOrm;

  constructor(_props) {
    const props = _props || {};
    Object.keys(props).map(name => this[name] = props[name]);
  }

  onAllStarted(containerInterface) {
    return Promise.resolve();
  }
}
