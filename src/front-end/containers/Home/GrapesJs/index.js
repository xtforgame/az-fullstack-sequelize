import React, { useState, useLayoutEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import axios from 'axios';
import useDialogState, { Cancel } from 'azrmui/hooks/useDialogState';
import { getHeaders } from 'azrmui/utils/HeaderManager';
import MinioFolderApiEx from './ui/MinioFolderApiEx';
import FilePicker from './ui/FilePicker';
import FileSaver from './ui/FileSaver';

const minioFolderApi = new MinioFolderApiEx();

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: 'inline',
  },
}));

const defaultCss = `
.panel {
  width: 90%;
  max-width: 700px;
  border-radius: 3px;
  padding: 30px 20px;
  margin: 150px auto 0px;
  background-color: #d983a6;
  box-shadow: 0px 3px 10px 0px rgba(0,0,0,0.25);
  color:rgba(255,255,255,0.75);
  font: caption;
  font-weight: 100;
}

@media (min-width: 768px) and (max-width: 979px) {
  .panel {
    max-width: 700px;
}
}

.welcome {
  text-align: center;
  font-weight: 100;
  margin: 0px;
}

.logo {
  width: 70px;
  height: 70px;
  vertical-align: middle;
}

.logo path {
  pointer-events: none;
  fill: none;
  stroke-linecap: round;
  stroke-width: 7;
  stroke: #fff
}

.big-title {
  text-align: center;
  font-size: 3.5rem;
  margin: 15px 0;
}

.description {
  text-align: justify;
  font-size: 1rem;
  line-height: 1.5rem;
}
`;

const defaultHtml = `
<div class="panel">
  <h1 class="welcome">Welcome to</h1>
  <div class="big-title">
    <svg class="logo" viewBox="0 0 100 100">
      <path d="M40 5l-12.9 7.4 -12.9 7.4c-1.4 0.8-2.7 2.3-3.7 3.9 -0.9 1.6-1.5 3.5-1.5 5.1v14.9 14.9c0 1.7 0.6 3.5 1.5 5.1 0.9 1.6 2.2 3.1 3.7 3.9l12.9 7.4 12.9 7.4c1.4 0.8 3.3 1.2 5.2 1.2 1.9 0 3.8-0.4 5.2-1.2l12.9-7.4 12.9-7.4c1.4-0.8 2.7-2.2 3.7-3.9 0.9-1.6 1.5-3.5 1.5-5.1v-14.9 -12.7c0-4.6-3.8-6-6.8-4.2l-28 16.2"/>
    </svg>
    <span>GrapesJS</span>
  </div>
  <!-- end social media -->
</div>
`;

const GrapesJs = (props) => {
  const {
    css = defaultCss,
    html = defaultHtml,
    id = 'gjs',
    routeView,
  } = props;
  const classes = useStyles();
  const editorRef = useRef(null);

  const [dialogState, setDialogState] = useState(null);
  const [dialogValue, setDialogValue] = useState([]);


  const [{
    exited,
    dialogProps,
  }, {
    handleOpen,
    // handleClose,
    // handleExited,
  }] = useDialogState({
    dialogProps: {},
    open: (v) => {
      console.log('v :', v);
    },
    close: (v2) => {
      console.log('v2 :', v2);
    },
  });

  return (
    <React.Fragment>
      {routeView}
      {!exited && false && (
        <FilePicker
          filePicker
          folderPicker
          api={minioFolderApi}
          dialogProps={dialogProps}
          value={dialogValue}
          onChange={setDialogValue}
        />
      )}
      {!exited && (
        <FileSaver
          api={minioFolderApi}
          defaultFileName="save-data-1-10.js"
          dialogProps={dialogProps}
          value={dialogValue}
          onChange={setDialogValue}
        />
      )}
    </React.Fragment>
  );
};

export default GrapesJs;
