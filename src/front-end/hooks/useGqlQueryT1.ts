import { useEffect, useMemo, useState } from 'react';
import { useQuery, gql, DocumentNode } from '@apollo/client';
import { buildQueryT1, OptionsT1 } from 'common/graphQL';

export {
  OptionsT1,
} from 'common/graphQL';

export default (collectionName : string, aggregateName : string, body: string = 'id', options : OptionsT1 = {}, memoArray : string[] = []) => {
  const {
    orderBy,
    where,
    wString,
    buildQueryString,
  } = buildQueryT1(collectionName, aggregateName, body, options);
  return useMemo<DocumentNode>(() => {
    const s = buildQueryString();
    if (options.debug) {
      console.log('GQL :', s);
    }
    return gql(s);
  }, [...memoArray, wString, orderBy, options.offset, options.limit]);
};
