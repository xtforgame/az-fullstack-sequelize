/* eslint-disable react/jsx-filename-extension */
import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogEx from 'azrmui/core/Dialogs/DialogEx';
import WithSearch from 'azrmui/core/FileManager/WithSearch';

export default (p) => {
  const {
    filePicker,
    folderPicker,
    title = 'Open',

    value,
    onChange,

    dialogProps,

    api,
    pickerProps = {},
  } = p;

  console.log('value :', value);

  return (
    <React.Fragment>
      <DialogEx
        fullHeight
        dialogProps={dialogProps}
      >
        <WithSearch
          {...pickerProps}
          getFileList={api.getFileList}
          createFileOrFolder={api.createFileOrFolder}
          canCreate={api.canCreate}
          isFileExists={api.isFileExists}
          title={title}
          value={value}
          onClose={() => dialogProps.onClose()}
          onChange={onChange}
          onSelect={(info, options) => {
            if (info.type === 'newFolder') {
              options.refresh();
              return;
            }
            if (filePicker) {
              const ps = options.paths.concat([info.relPath]);
              dialogProps.onClose({
                paths: ps,
                path: ps.join('/'),
                type: 'file',
              });
            }
          }}
          // customProps={{
          //   getActionMenuItems: (closeMenu, options) => [
          //     <MenuItem
          //       key="delete"
          //       selected
          //       onClick={(event) => {
          //         options.clearList();
          //         setTimeout(() => {
          //           options.refresh();
          //         }, 1000);
          //         // handleClose(2);
          //         closeMenu();
          //       }}
          //     >
          //       Delete
          //     </MenuItem>,
          //   ],
          // }}
        />
        <DialogActions>
          {folderPicker && (
            <Button
              autoFocus
              onClick={() => {
                const ps = value;
                dialogProps.onClose({
                  paths: ps,
                  path: ps.join('/'),
                  type: 'folder',
                });
              }}
              color="primary"
            >
              Select Folder
            </Button>
          )}
        </DialogActions>
      </DialogEx>
    </React.Fragment>
  );
};
