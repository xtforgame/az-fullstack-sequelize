import { useEffect, useMemo, useState } from 'react';
import { useQuery, gql, DocumentNode } from '@apollo/client';
import { buildQueryT1, Options } from 'common/graphQL';

export default (listName : string, aggregateName : string, body: string = 'id', options : Options = {}, memoArray : string[] = []) => {
  const {
    orderBy,
    where,
    wString,
    buildQueryString,
  } = buildQueryT1(listName, aggregateName, body, options);
  return useMemo<DocumentNode>(() => {
    const s = buildQueryString();
    if (options.debug) {
      console.log('GQL :', s);
    }
    return gql(s);
  }, [...memoArray, wString, orderBy, options.offset, options.limit]);
};
