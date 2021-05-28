import React, { useEffect, useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import BasicSection from '~/components/Section/Basic';
import LoadingMask from '~/components/TableShared/LoadingMask';
import Editor from './Editor';

const PRODUCT_GROUP_QUERY = gql`
  query Order($id: bigint! = 0) {
    order(id: $id){
      id
      user { id, name }
      buyer
      recipient
      data
      metadata
      created_at

      state
      memo
      payWay
      selectedAt
      expiredAt
      paidAt
      shippedAt
      invoiceNumber
      invoiceStatus
      atmAccount
      esunData
      esunOrderId
      esunTradeInfo
      esunTradeState
      paypalData
      paypalToken
      cvsName
      smseData
      smsePayno
      smseSmilepayno

      products {
        price
        quantity
        subtotal
        assignedQuantity
        order_id
        id
        data
        product_id
        product {
          name
          customId
          id
          size
          instock
          orderQuota
          soldout
        }
      }
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

  const refresh = async () => {
    setRefreshCount(refreshCount + 1);
  };


  return (
    <BasicSection withMaxWith>
      {(!loading && !error && data && data.order) && (
        <Editor
          editingData={data.order}
          refresh={refresh}
        />
      )}
      <LoadingMask loading={loading || !data} />
    </BasicSection>
  );
};
