import React from 'react';

export default props => (
  <pre
    {...props}
    style={{
      wordWrap: 'break-word',
      whiteSpace: 'pre-wrap',
    }}
  />
);
