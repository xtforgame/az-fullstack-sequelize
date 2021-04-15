import React, { useEffect, useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import BasicSection from '~/components/Section/Basic';
import LoadingMask from '~/components/EnhancedTable/LoadingMask';
import CampaignEditor from './Editor';

const CAMPAIGN_QUERY = gql`
  query Campaign($id: bigint! = 0) {
    campaign(id: $id){
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
`;

export default (props) => {
  const [refreshCount, setRefreshCount] = useState(0);

  const {
    match,
  } = props;

  const {
    id,
  } = match.params;

  const { loading, error, data } = useQuery(CAMPAIGN_QUERY, {
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
        Error in CAMPAIGN_QUERY
        {JSON.stringify(error, null, 2)}
      </pre>
    );
  }

  return (
    <BasicSection withMaxWith>
      {(!loading && !error && data && data.campaign) && (
        <CampaignEditor
          editingData={data.campaign}
        />
      )}
      <LoadingMask loading={loading || !data} />
    </BasicSection>
  );
};