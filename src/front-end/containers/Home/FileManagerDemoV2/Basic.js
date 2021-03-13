import React from 'react';
import FileManager from 'azrmui/core/FileManager';

export default (props) => (
  <div style={{ border: 'solid', borderWidth: 1, borderColor: 'black', height: 400 }}>
    <FileManager
      getFileList={props.getFileList}
      onSelect={() => {}}
      selection={[]}
      SwipeableViewsProps={{
        onTransitionEnd: () => {
          console.log('onTransitionEnd');
        },
      }}
      customProps={{ customValue: 1 }}
    />
  </div>
);
