import React, { useState } from 'react';
import WithSearch from 'azrmui/core/FileManager/WithSearch';

export default props => (
  <div style={{ display: 'flex', height: '100%', border: 'solid', borderWidth: 1, borderColor: 'black', height: 500, overflowY: 'hidden' }}>
    <WithSearch
      {...props}
      title="Open"
      SwipeableViewsProps={{
        onTransitionEnd: () => {
          console.log('onTransitionEnd');
        },
      }}
    />
  </div>
);
