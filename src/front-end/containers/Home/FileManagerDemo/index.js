import React from 'react';
import Basic from './Basic';
import FilePicker from 'azrmui/core/FileManager/FilePicker';
import FileSaver from 'azrmui/core/FileManager/FileSaver';
import WithSearchExample from './WithSearchExample';
import { getFileList, canCreate, isFileExists, createFileOrFolder } from './shared';

export default () => {
  const x = 1;
  return (
    <React.Fragment>
      {/* <div style={{ padding: 16 }}>
        <Basic
          getFileList={getFileList}
          createFileOrFolder={createFileOrFolder}
          canCreate={canCreate}
          isFileExists={isFileExists}
        />
      </div>
      <div style={{ padding: 16 }}>
        <WithSearchExample
          getFileList={getFileList}
          createFileOrFolder={createFileOrFolder}
          canCreate={canCreate}
          isFileExists={isFileExists}
        />
      </div> */}
      <div style={{ padding: 16 }}>
        <FilePicker
          filePicker
          folderPicker
          getFileList={getFileList}
          createFileOrFolder={createFileOrFolder}
          canCreate={canCreate}
          isFileExists={isFileExists}
          defaultPaths={['save-data-1']}
          onSelected={(v) => { console.log('v :', v); }}
        />
      </div>
      <div style={{ padding: 16 }}>
        <FileSaver
          getFileList={getFileList}
          createFileOrFolder={createFileOrFolder}
          canCreate={canCreate}
          isFileExists={isFileExists}
          defaultPaths={['save-data-1']}
          defaultFileName="save-data-1-10.js"
          onSelected={(v) => { console.log('v :', v); }}
        />
      </div>
    </React.Fragment>
  );
};
