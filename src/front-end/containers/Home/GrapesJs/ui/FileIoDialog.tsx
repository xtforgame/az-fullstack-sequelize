/* eslint-disable react/jsx-filename-extension */
import React, { useState, useLayoutEffect, useRef } from 'react';
// import { makeStyles } from '@material-ui/core/styles';
import FilePicker from './FilePicker';
import FileSaver from './FileSaver';

// const useStyles = makeStyles(theme => ({
//   root: {
//     width: '100%',
//     maxWidth: 360,
//     backgroundColor: theme.palette.background.paper,
//   },
//   inline: {
//     display: 'inline',
//   },
// }));

const FileIoDialog = (props) => {
  const {
    api,
    dialogProps,
    title,
    value,
    onChange,
    dialogState,
    defaultFileName,
  } = props;
  // const classes = useStyles();

  return (
    <React.Fragment>
      {dialogState.type === 'picker' && (
        <FilePicker
          filePicker
          folderPicker
          api={api}
          dialogProps={dialogProps}
          title={title}
          value={value}
          onChange={onChange}
          defaultFileName={defaultFileName || ''}
        />
      )}
      {dialogState.type === 'saver' && (
        <FileSaver
          api={api}
          dialogProps={dialogProps}
          title={title}
          value={value}
          onChange={onChange}
          defaultFileName={defaultFileName || ''}
        />
      )}
    </React.Fragment>
  );
};

export default FileIoDialog;
