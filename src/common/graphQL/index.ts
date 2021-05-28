export type Options = {
  args?: string[];
  where?: string[];
  orderBy?: string;
  offset?: number;
  limit?: number;
  debug?: boolean;
};

export const buildQueryT1 = (listName : string, aggregateName : string | null, body: string = 'id', options : Options = {}) => {
  const orderBy = options.orderBy || '{created_at: desc}';

  const where = options.where || [];
  const wString = where.concat(['{deleted_at: {_is_null: true}}'])
  .join(',');

  const aggregatePart = aggregateName ? `${aggregateName}(
    where: {
      _and: [${wString}]
    },
  ) {
    aggregate {
      count
    }
  }` : '';

  const buildBodyString = () => `
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
    ${aggregatePart}
  `;

  const buildQueryString = () => `
    query Query ${options.args && options.args.length ? `(${options.args.join(',')})` : ''} {
      ${buildBodyString()}
    }
  `;
  return {
    orderBy,
    where,
    wString,
    buildBodyString,
    buildQueryString,
  };
};
