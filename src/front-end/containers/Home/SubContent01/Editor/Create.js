import React, { useEffect, useState } from 'react';
import BasicSection from '~/components/Section/Basic';
import Editor from './Editor';

export default (props) => (
  <BasicSection withMaxWith>
    <Editor
      editingData={null}
    />
  </BasicSection>
);
