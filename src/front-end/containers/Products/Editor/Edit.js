import React, { useEffect, useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import BasicSection from '~/components/Section/Basic';
import LoadingMask from '~/components/EnhancedTable/LoadingMask';
import Editor from './Editor';

const PRODUCT_QUERY = gql`
  query Product($id: bigint! = 0) {
    product(id: $id){
      id
      uid
      customId
      group {
        id
        name
        products(where: {deleted_at: {_is_null: true}}) {
          id
          name
        }
        category {
          id
          name
        }
        campaigns(where: {deleted_at: {_is_null: true}}) {
          campaign {
            id
            name
            type
            durationType
            state
            start
            end
            data
            created_at
            updated_at
            deleted_at
          }
        }
      }
      color
      colorName
      colorCode
      size
      thumbnail
      pictures
      name
      price
      weight
      ordering
      instock
      orderQuota
      description
      data
      disabled
      isLimit
      soldout
      priority
      sizeChart
    }
  }
`;

export default (props) => {
  const [refreshCount, setRefreshCount] = useState(0);

  const {
    match,
  } = props;

  const {
    id,
  } = match.params;

  const { loading, error, data } = useQuery(PRODUCT_QUERY, {
    variables: {
      name: refreshCount.toString(),
      id,
    },
    fetchPolicy: 'network-only',
  });

  // if (loading || !data) return <pre>Loading</pre>;
  if (error) {
    return (
      <pre>
        Error in PRODUCT_QUERY
        {JSON.stringify(error, null, 2)}
      </pre>
    );
  }

  return (
    <BasicSection withMaxWith>
      {(!loading && !error && data && data.product) && (
        <Editor
          editingData={data.product}
        />
      )}
      <LoadingMask loading={loading || !data} />
    </BasicSection>
  );
};
