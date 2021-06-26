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

export default class LineProvider extends BaseProvider {
  static requiredAuthParams : RequiredAuthParams = ['userId'];

  static providerId : ProviderId = 'line';

  static providerUserIdName : ProviderUserId = 'userId';

  async verifyAuthParams(authParams : AuthParams, accountLink : AccountLink) : Promise<AccountLink> {
    // const { userId } = authParams;
    return Promise.resolve(accountLink);
  }

  async getAccountLinkParamsForCreate(alParams : AccountLinkParams) : Promise<AccountLinkParams> {
    const result = this.checkParams(alParams, ['userId']);
    if (result) {
      return Promise.reject(result);
    }
    const params = {
      provider_id: this.providerId,
      provider_user_id: alParams.userId,
      provider_user_access_info: {
      },
    };
    return addInitDataToAccountLink(params);
  }
}
