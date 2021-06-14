import { RestfulError } from 'az-restful-helpers';
import {
  CheckParamsFunction,

  AuthParams,
  RequiredAuthParams,

  AccountLinkParams,

  ProviderId,
  ProviderUserId,
  AccountLink,
  AuthProvider,
  BasicProvider as BaseProvider,
} from 'az-authn-kit-v2';
import { addInitDataToAccountLink } from '~/domain-logic';
import { hashPassword, comparePasswordHash } from '~/domain-logic/common';

export default class FacebookProvider extends AuthProvider {
  static requiredAuthParams : RequiredAuthParams = ['userId'];

  static providerId : ProviderId = 'facebook';

  static providerUserIdName : ProviderUserId = 'userId';

  get requiredAuthParams() : RequiredAuthParams {
    return (<any>this.constructor).requiredAuthParams;
  }

  get providerId() : ProviderId {
    return (<any>this.constructor).providerId;
  }

  get providerUserId() : ProviderUserId {
    return (<any>this.constructor).providerUserId;
  }

  async verifyAuthParams(authParams : AuthParams, accountLink : AccountLink) : Promise<AccountLink> {
    // const { userId } = authParams;
    return Promise.resolve(accountLink);
  }

  async getAccountLinkParamsForCreate(alParams : AccountLinkParams) : Promise<AccountLinkParams> {
    const result = this.checkParams(alParams, ['userId', 'userData']);
    if (result) {
      return Promise.reject(result);
    }
    return addInitDataToAccountLink({
      provider_id: this.providerId,
      provider_user_id: alParams.userId,
      provider_user_access_info: alParams.userData,
    });
  }
}
