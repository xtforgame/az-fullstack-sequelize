export type OptionsT1 = {
  args?: string[];
  where?: string[];
  orderBy?: string;
  offset?: number;
  limit?: number;
  debug?: boolean;
};

export const buildQueryT1 = (collectionName : string, aggregateName : string | null, body: string = 'id', options : OptionsT1 = {}) => {
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
    ${collectionName}(
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

export type OptionsT2 = {
  args?: string[];
  id?: any;
  debug?: boolean;
};

export const buildQueryT2 = (collectionName : string, body: string = 'id', options: OptionsT2 = {}) => {
  const {
    id = '$id',
    args = ['$id: bigint!'],
  } = options;
  const buildBodyString = () => `
    ${collectionName}(id: ${id}) {
      ${body}
    }
  `;

  const buildQueryString = () => `
    query Query ${args && args.length ? `(${args.join(',')})` : ''} {
      ${buildBodyString()}
    }
  `;
  return {
    buildBodyString,
    buildQueryString,
  };
};
