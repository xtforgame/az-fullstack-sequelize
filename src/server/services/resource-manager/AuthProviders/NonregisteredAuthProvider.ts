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
} from 'az-authn-kit-v2';
import { addInitDataToAccountLink } from '~/domain-logic';

export default class NonregisteredAuthProvider extends AuthProvider {
  static requiredAuthParams : RequiredAuthParams = ['uniqueKey'];

  static providerId : ProviderId = 'non-registered';

  static providerUserIdName : ProviderUserId = 'uniqueKey';

  verifyAuthParams(authParams : AuthParams, accountLink : AccountLink) : Promise<AccountLink> {
    return Promise.resolve(accountLink);
    return RestfulError.rejectWith(401, 'Wrong credential');
  }

  getAccountLinkParamsForCreate(alParams : AccountLinkParams) : Promise<AccountLinkParams> {
    const result = this.checkParams(alParams, ['uniqueKey']);
    if (result) {
      return Promise.reject(result);
    }
    return Promise.resolve(addInitDataToAccountLink({
      provider_id: this.providerId,
      provider_user_id: alParams.uniqueKey,
      provider_user_access_info: {
        authMethod: alParams.uniqueKey.split(':')[0],
      },
    }));
  }
}
