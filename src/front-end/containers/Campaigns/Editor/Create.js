import React, { useEffect, useState } from 'react';
import BasicSection from '~/components/Section/Basic';
import CampaignEditor from './Editor';

export default (props) => (
  <BasicSection withMaxWith>
    <CampaignEditor
      editingData={null}
    />
  </BasicSection>
);
