/* eslint-disable react/jsx-filename-extension */
import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
// import MenuItem from '@material-ui/core/MenuItem';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import useStateWithError from 'azrmui/hooks/useStateWithError';
import useDialogState /* , { Cancel } */ from 'azrmui/hooks/useDialogState';
import DialogEx from 'azrmui/core/Dialogs/DialogEx';
import ConfirmDialog from 'azrmui/core/Dialogs/ConfirmDialog';

import { makeStyles } from '@material-ui/core/styles';

import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import { blue } from '@material-ui/core/colors';
import BreakAllCodeBlock from 'azrmui/core/Text/BreakAllCodeBlock';

const useStyles = makeStyles({
  avatar: {
    backgroundColor: blue[100],
    color: blue[600],
  },
  ecDialogPaper: {
    maxWidth: 'calc(100% - 24px)',
  },
});

export default (p) => {
  const {
    defaultFileName = '',
    title = 'Save As...',
    editingData,
    dialogProps,

    value,
    onChange,
    api,
    saverProps = {},
  } = p;

  const { html, css, fullJson } = editingData || {};

  const [filename, setFilename, filenameError, setFilenameError] = useStateWithError(defaultFileName || '');

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

  const classes = useStyles();

  return (
    <React.Fragment>
      <DialogEx
        fullHeight
        fullWidth
        dialogProps={{
          ...dialogProps,
          maxWidth: false,
          PaperProps: {
            className: classes.ecDialogPaper,
          },
        }}
      >
        {/* <DialogTitle id="simple-dialog-title">Set backup account</DialogTitle> */}
        <DialogContent>
          {/* <div>
            {html}
          </div>
          <div>
            {css}
          </div> */}
          <BreakAllCodeBlock>
            {fullJson}
          </BreakAllCodeBlock>
        </DialogContent>
        <Button
          autoFocus
          onClick={() => {
            onChange();
          }}
          color="primary"
        >
          Save
        </Button>
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
