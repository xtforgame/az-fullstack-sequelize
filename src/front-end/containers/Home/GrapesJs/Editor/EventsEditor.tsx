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
import MenuItem from '@material-ui/core/MenuItem';
import { FormFieldButtonSelect } from 'azrmui/core/FormInputs';


import { makeStyles } from '@material-ui/core/styles';

import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import PersonIcon from '@material-ui/icons/Person';
import AddIcon from '@material-ui/icons/Add';
import Typography from '@material-ui/core/Typography';
import { blue } from '@material-ui/core/colors';

const emails = ['username@gmail.com', 'user02@gmail.com'];
const useStyles = makeStyles({
  avatar: {
    backgroundColor: blue[100],
    color: blue[600],
  },
});

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

  const classes = useStyles();

  const handleListItemClick = (value) => {
    onChange(value);
  };

  const [selectedExEvent, setSelectedExEvent] = useState({ id: 0 });
  const [exEventsArray, setExEventArray] = useState([
    { id: 1, name: 'click' },
    { id: 2, name: 'onoff' },
    { id: 3, name: 'textinput' },
    { id: 4, name: 'selectinput' },
    { id: 5, name: 'arrayinput' },
    { id: 6, name: 'objectinput' },
  ]);


  const getMenuItem = ({
    option,
    // selectedOption,
    // isSelected,
    handleOptionClick,
  }) => (
    <MenuItem
      key={option.id}
      selected={option.id === (selectedExEvent && selectedExEvent.id)}
      onClick={handleOptionClick}
    >
      {`${option.name}`}
    </MenuItem>
  );

  const handleMenuItemClick = (event, exEvent, i) => {
    setSelectedExEvent(exEvent);
  };

  return (
    <React.Fragment>
      <DialogEx
        fullHeight
        dialogProps={dialogProps}
      >
        <DialogTitle id="simple-dialog-title">Set backup account</DialogTitle>
        <DialogContent>
          <FormFieldButtonSelect
            id="ex-event-selector"
            label="專案"
            fullWidth
            value={selectedExEvent}
            options={exEventsArray}
            getMenuItem={getMenuItem}
            onChange={handleMenuItemClick}
            toInputValue={exEvents => (exEvents && `${exEvents.name}`) || '<未選取>'}
            toButtonValue={exEvents => `${(exEvents && exEvents.name) || '<未選取>'}`}
            margin="dense"
          />
          <List>
            {emails.map(email => (
              <ListItem button onClick={() => handleListItemClick(email)} key={email}>
                <ListItemAvatar>
                  <Avatar className={classes.avatar}>
                    <PersonIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={email} />
              </ListItem>
            ))}

            <ListItem autoFocus button onClick={() => handleListItemClick('addAccount')}>
              <ListItemAvatar>
                <Avatar>
                  <AddIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="Add account" />
            </ListItem>
          </List>
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
