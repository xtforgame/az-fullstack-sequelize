import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import useFormDialogInput from 'azrmui/core/FormInputs/FormDialogInput/useFormDialogInput';
import useStateWithError from 'azrmui/core/../hooks/useStateWithError';
import useDialogState, { Cancel } from 'azrmui/hooks/useDialogState';
import DialogEx from 'azrmui/core/Dialogs/DialogEx';
import ConfirmDialog from 'azrmui/core/Dialogs/ConfirmDialog';
import { FormTextField } from 'azrmui/core/FormInputs';

export default (props) => {
  const {
    onChange = (v) => {
    },
    searchText = '',
  } = props;
  const [value, setValue] = useState(searchText || '');

  const {
    renderButton,
    renderDialog,
    useDialogWithButtonStateResult: [, { handleClose }],
  } = useFormDialogInput({
    displayValue: v => v,
    onChange: (v) => {
      onChange(v);
      // console.log('v :', v);
    },
    onClose: (x) => {
    },
    value,
    renderButton: ({ buttonProps }) => (
      <IconButton {...buttonProps} color="inherit" aria-label="refresh">
        <SearchIcon />
      </IconButton>
    ),
    renderDialog: ({
      value,
      handleClose,
      dialogProps,
    }) => (
      <DialogEx
        // fullHeight
        dialogProps={dialogProps}
      >
        <DialogTitle id="alert-dialog-title">搜尋</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <FormTextField
              id="querytext"
              label="搜尋文字"
              // onPressEnter={e => setSearchQuery(e.target.value)}
              value={value}
              onChange={e => setValue(e.target.value)}
              // autoFocus
              margin="dense"
              fullWidth
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose()}>
            取消
          </Button>
          <Button color="primary" onClick={() => handleClose(value)} autoFocus>
            搜尋
          </Button>
        </DialogActions>
      </DialogEx>
    ),
  });


  return (
    <React.Fragment>
      {renderButton()}
      {renderDialog()}
    </React.Fragment>
  );
};
