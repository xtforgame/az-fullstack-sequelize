import AmmOrm from 'az-model-manager/core';
import sendGraphQLRequest from '~/utils/sendGraphQLRequest';
import { AuthKit } from '../services/resource-manager/interfaces';
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

  async sendGraphQLRequest<T = any>(query: string, variables?: any) : Promise<GqlResult<T>> {
    return sendGraphQLRequest<T>(query, variables);
  }
}
