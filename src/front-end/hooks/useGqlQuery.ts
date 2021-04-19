import { useEffect, useMemo, useState } from 'react';
import { useQuery, gql, DocumentNode } from '@apollo/client';

type Options = {
  args?: string[],
  where?: string[],
  orderBy?: string,
  offset?: number,
  limit?: number,
};

export default (listName : string, aggregateName : string, body: string = 'id', options : Options = {}, memoArray : string[] = []) => {
  const orderBy = options.orderBy || '{created_at: desc}';

  const where = options.where || [];
  const wString = where.concat(['{deleted_at: {_is_null: true}}'])
  .join(',');
  return useMemo<DocumentNode>(() => {
    const s = `
      query Query ${options.args ? `(${options.args.join(',')})` : ''} {
        ${listName}(
          where: {
            _and: [${wString}]
          },
          order_by: ${orderBy},
          ${options.offset ? `offset: ${options.offset},` : ''}
          ${options.limit ? `limit: ${options.limit},` : ''}
        ) {
          ${body}
        }
        ${aggregateName}(
          where: {
            _and: [${wString}]
          },
        ) {
          aggregate {
            count
          }
        }
      }
    `;
    console.log('s :', s);
    return gql(s);
  }, [...memoArray, wString, orderBy, options.offset, options.limit]);
};
