import React, { useEffect, useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import BasicSection from '~/components/Section/Basic';
import LoadingMask from '~/components/TableShared/LoadingMask';
import Editor from './Editor';

const PRODUCT_CATEGORY_QUERY = gql`
  query ProductCategory($id: bigint! = 0) {
    productCategory(id: $id){
      id
      name
      nameEn
      priority
      active
      data

      code
      specsText
      specPic
      specsDesc
      modelsReference1
      modelsReference2
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

  const { loading, error, data } = useQuery(PRODUCT_CATEGORY_QUERY, {
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
        Error in PRODUCT_CATEGORY_QUERY
        {JSON.stringify(error, null, 2)}
      </pre>
    );
  }

  const refresh = async () => {
    setRefreshCount(refreshCount + 1);
  };


  return (
    <BasicSection withMaxWith>
      {(!loading && !error && data && data.productCategory) && (
        <Editor
          editingData={data.productCategory}
          refresh={refresh}
        />
      )}
      <LoadingMask loading={loading || !data} />
    </BasicSection>
  );
};
