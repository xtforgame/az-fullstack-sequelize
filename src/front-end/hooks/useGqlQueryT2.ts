import { useEffect, useMemo, useState } from 'react';
import { useQuery, gql, DocumentNode } from '@apollo/client';
import { buildQueryT2, OptionsT2 } from 'common/graphQL';

export {
  OptionsT2,
};

export default (resourceName : string, body: string = 'id', options : OptionsT2 = {}, memoArray : string[] = []) => {
  const {
    buildQueryString,
  } = buildQueryT2(resourceName, body, options);
  return useMemo<DocumentNode>(() => {
    const s = buildQueryString();
    if (options.debug) {
      console.log('GQL :', s);
    }
    return gql(s);
  }, memoArray);
};
