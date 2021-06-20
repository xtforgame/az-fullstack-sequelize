import fs from 'fs';
import sass from 'sass';
import axios from 'axios';
import { hasuraEndpoint } from 'common/config';
import { GqlResult } from 'common/graphQL';
import { hasuraAdminSecret } from 'config';

export default async function sendGraphQLRequest<T = any>(query: string, variables: any = {}) : Promise<GqlResult<T>> {
  const { data } = await axios({
    url: hasuraEndpoint,
    method: 'post',
    headers: {
      'X-Hasura-Role': 'admin',
      'X-Hasura-Admin-Secret': hasuraAdminSecret,
      'Content-Type': 'application/json',
    },
    data: {
      query,
      variables,
    },
  });
  return data;
}
