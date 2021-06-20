/* eslint-disable react/sort-comp */
import axios from 'axios';
import { GqlResult } from 'common/graphQL';

export const sendGraphQLRequest = async <T = any>(query: string) : Promise<GqlResult<T>> => {
  const { data } = await axios({
    url: 'v1/graphql',
    headers: {},
    method: 'post',
    data: {
      query,
    },
  });
  return data;
};
