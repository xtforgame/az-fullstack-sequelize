import React from 'react';

export default props => (
  <pre
    {...props}
    style={{
      fontFamily: 'monospace,monospace',
      wordWrap: 'break-word',
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-all',
    }}
  />
);
