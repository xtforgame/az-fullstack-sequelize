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

export default class BasicProvider extends BaseProvider {
  async verifyAuthParams(authParams : AuthParams, accountLink : AccountLink) : Promise<AccountLink> {
    const { password } = authParams;
    const cryptedPassword = accountLink.provider_user_access_info && accountLink.provider_user_access_info.password;
    if (comparePasswordHash(password, cryptedPassword)) {
      return Promise.resolve(accountLink);
    }
    return RestfulError.rejectWith(401, 'Wrong credential');
  }

  async getAccountLinkParamsForCreate(alParams : AccountLinkParams) : Promise<AccountLinkParams> {
    const result = this.checkParams(alParams, ['username', 'password']);
    if (result) {
      return Promise.reject(result);
    }
    const params = {
      provider_id: this.providerId,
      provider_user_id: alParams.username,
      provider_user_access_info: {
        password: hashPassword(alParams.password),
      },
    };
    return addInitDataToAccountLink(params);
  }
}
