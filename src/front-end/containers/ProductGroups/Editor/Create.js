import React, { useEffect, useState } from 'react';
import BasicSection from '~/components/Section/Basic';
import ProductGroupEditor from './Editor';

export default (props) => (
  <BasicSection withMaxWith>
    <ProductGroupEditor
      editingData={null}
    />
  </BasicSection>
);
