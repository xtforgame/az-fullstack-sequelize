import React, { useState, useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import { push } from 'connected-react-router';
import { createStructuredSelector } from 'reselect';
import { useConnect } from 'azrmui/hooks/redux-react-hook-ex';
import pathLib from 'path';
import clsx from 'clsx';
import axios from 'axios';
import useDialogState, { Cancel } from 'azrmui/hooks/useDialogState';
import MinioFolderApiEx from './ui/MinioFolderApiEx';
import FileIoDialog from './ui/FileIoDialog';
import FragmentCard from './FragmentCard';

const useStyles = makeStyles(theme => ({
  mainContainer: {
    margin: 8,
    [theme.breakpoints.up('sm')]: {
      margin: 40,
    },
    height: '100%',
  },
  cardContainer: {
    display: 'flex',
    flexWrap: 'wrap',
  },
}));

const mapStateToProps = createStructuredSelector({});

const mapDispatchToProps = { push };


const Fragment = (props) => {
  const {
    routeView,
    match,
  } = props;
  const {
    push,
  } = useConnect(mapStateToProps, mapDispatchToProps);

  const classes = useStyles();

  const apiRef = useRef(new MinioFolderApiEx('p', '1', 'np-fragments'));
  const minioFolderApi = apiRef.current;

  const [reloadKey, setReloadKey] = useState(0);
  const [fragments, setFragments] = useState([]);

  const [dialogState, setDialogState] = useState({ type: 'saver' });
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
      if (v2 && dialogState.type === 'saver') {
        minioFolderApi.createFragmentFile(v2.path)
        .then(({ data }) => {
          setReloadKey(r => r + 1);
          console.log('data :', data);
        });
      }
    },
  });

  const newFragment = () => {
    setDialogState({ type: 'saver' });
    handleOpen();
  };

  useEffect(() => {
    minioFolderApi.getFileListEx()
    .then((files) => {
      apiRef.current = new MinioFolderApiEx('p', '1', 'np-fragments');
      setFragments(files);
    });
    // handleOpen();
  }, [reloadKey]);

  return (
    <div className={classes.mainContainer}>
      <FragmentCard
        image="https://placehold.jp/99ccff/003366/345x140.png?text=建立新片段"
        fragmentFilename="<New>"
        onClick={newFragment}
      />
      <Divider />
      <div className={classes.cardContainer}>
        {fragments.filter(f => f.type === 'file').map(f => (
          <FragmentCard
            key={f.name}
            fragmentFilename={f.name.split('.')[0]}
            onClick={() => {
              push(pathLib.join(match.path, 'p', '1', f.name));
            }}
          />
        ))}
      </div>
      {!exited && (
        <FileIoDialog
          api={minioFolderApi}
          defaultFileName="新的片段.agf"
          dialogProps={dialogProps}
          title="建立新的片段"
          dialogState={dialogState}
          value={dialogValue}
          onChange={setDialogValue}
        />
      )}
    </div>
  );
};

export default Fragment;
