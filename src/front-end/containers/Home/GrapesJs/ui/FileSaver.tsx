/* eslint-disable react/jsx-filename-extension */
import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
// import MenuItem from '@material-ui/core/MenuItem';
import DialogActions from '@material-ui/core/DialogActions';
import useStateWithError from 'azrmui/hooks/useStateWithError';
import useDialogState /* , { Cancel } */ from 'azrmui/hooks/useDialogState';
import DialogEx from 'azrmui/core/Dialogs/DialogEx';
import ConfirmDialog from 'azrmui/core/Dialogs/ConfirmDialog';
import { FormTextField } from 'azrmui/core/FormInputs';
import WithSearch from 'azrmui/core/FileManager/WithSearch';


export default (p) => {
  const {
    defaultFileName = '',
    title = 'Save As...',
    dialogProps,

    value,
    onChange,
    api,
    saverProps = {},
  } = p;

  const [filename, setFilename, filenameError, setFilenameError] = useStateWithError(defaultFileName || '');
  const [viewCallbacks, updateViewCallbacks] = useState({
    clearList: () => {},
    refresh: () => {},
    getViewOptions: () => ({}),
  });

  const save = (handleClose) => {
    const ps = value.concat([filename]);
    handleClose({
      paths: ps,
      path: ps.join('/'),
      type: 'file',
    });
  };

  const [{
    // open,
    exited: overwriteDialogExited,
    dialogProps: overwriteDialogOpenProps,
  }, {
    // setOpen,
    // setExited,
    handleOpen: handleOverwriteDialogOpen,
    handleClose: handleOverwriteDialogClose,
    // handleExited,
  }] = useDialogState({
    open: (v) => {
      // console.log('v :', v);
    },
    close: (v) => {
      // if (v !== undefined && v !== Cancel) {
      if (v === true) {
        save(dialogProps.onClose);
      }
    },
  });

  return (
    <React.Fragment>
      <DialogEx
        fullHeight
        dialogProps={dialogProps}
      >
        <WithSearch
          {...saverProps}
          getFileList={api.getFileList}
          createFileOrFolder={api.createFileOrFolder}
          canCreate={api.canCreate}
          isFileExists={api.isFileExists}
          title={title}
          value={value}
          onChange={onChange}
          onClose={() => dialogProps.onClose()}
          updateViewCallbacks={updateViewCallbacks}
          onSelect={(info, options) => {
            if (info.type === 'newFolder') {
              options.refresh();
              return;
            }
            setFilename(info.relPath);
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
          <FormTextField
            error={!!filenameError}
            helperText={filenameError}
            // label={label}
            // onKeyPress={handleEnterForTextField}
            value={filename}
            onChange={e => setFilename(e.target.value)}
            autoFocus
            margin="dense"
            fullWidth
          />
          <Button
            autoFocus
            onClick={() => {
              const handleSave = () => {
                const result = api.isFileExists({
                  filename,
                  type: 'file',
                  params: {
                    options: viewCallbacks.getViewOptions(),
                  },
                });
                console.log('filename :', filename);
                if (result === true) {
                  handleOverwriteDialogOpen();
                } else if (result === false) {
                  save(dialogProps.onClose);
                } else {
                  result.then((r) => {
                    if (r === true) {
                      handleOverwriteDialogOpen();
                    } else if (r === false) {
                      save(dialogProps.onClose);
                    }
                  });
                }
              };
              if (api.canCreate) {
                try {
                  const result = api.canCreate({
                    filename,
                    type: 'file',
                    params: {
                      options: viewCallbacks.getViewOptions(),
                    },
                  });
                  if (!result) {
                    handleSave();
                  }
                  if (typeof result === 'string') {
                    setFilenameError(result);
                    return;
                  } else {
                    result.then((errorMsg) => {
                      if (errorMsg) {
                        setFilenameError(errorMsg);
                        return;
                      }
                      handleSave();
                    });
                  }
                } catch (error) {
                  setFilenameError(error.message);
                }
              }
            }}
            color="primary"
          >
            Save
          </Button>
        </DialogActions>
      </DialogEx>
      {!overwriteDialogExited && (
        <ConfirmDialog
          title="File exists"
          contentText="File exists, do you want to overwrite?"
          onClose={handleOverwriteDialogClose}
          dialogProps={overwriteDialogOpenProps}
        />
      )}
    </React.Fragment>
  );
};
