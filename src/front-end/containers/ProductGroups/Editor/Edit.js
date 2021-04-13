import React, { useEffect, useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import BasicSection from '~/components/Section/Basic';
import LoadingMask from '~/components/EnhancedTable/LoadingMask';
import ProductGroupEditor from './Editor';

const PRODUCT_GROUP_QUERY = gql`
  query ProductGroup($id: bigint! = 0) {
    productGroup(id: $id){
      id
      customId
      products { id, name }
      category { id, name }
      campaigns { campaign { id, name } }
      thumbnail
      pictures
      name
      price
      weight
      description
      data
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

  const { loading, error, data } = useQuery(PRODUCT_GROUP_QUERY, {
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
        Error in PRODUCT_GROUP_QUERY
        {JSON.stringify(error, null, 2)}
      </pre>
    );
  }

  return (
    <BasicSection withMaxWith>
      {(!loading && !error && data && data.productGroup) && (
        <ProductGroupEditor
          editingData={data.productGroup}
        />
      )}
      <LoadingMask loading={loading || !data} />
    </BasicSection>
  );
};
