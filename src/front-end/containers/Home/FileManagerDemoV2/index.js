import React from 'react';

import FilePicker from 'azrmui/core/FileManager/FilePicker';
import FileSaver from 'azrmui/core/FileManager/FileSaver';
import Basic from './Basic';
import WithSearchExample from './WithSearchExample';
import MinioFolderApi from '../../../utils/MinioFolderApi';

const minioFolderApi = new MinioFolderApi();

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
          // folderPicker
          getFileList={minioFolderApi.getFileList}
          createFileOrFolder={minioFolderApi.createFileOrFolder}
          canCreate={minioFolderApi.canCreate}
          isFileExists={minioFolderApi.isFileExists}
          defaultPaths={[]}
          onSelected={(v) => { console.log('v :', v); }}
        />
      </div>
      <div style={{ padding: 16 }}>
        <FileSaver
          getFileList={minioFolderApi.getFileList}
          createFileOrFolder={minioFolderApi.createFileOrFolder}
          canCreate={minioFolderApi.canCreate}
          isFileExists={minioFolderApi.isFileExists}
          defaultPaths={[]}
          defaultFileName="save-data-1-10.js"
          onSelected={(v) => { console.log('v :', v); }}
        />
      </div>
    </React.Fragment>
  );
};
