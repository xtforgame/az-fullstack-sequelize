/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import Button from '@material-ui/core/Button';
// import MenuItem from '@material-ui/core/MenuItem';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import useDialogState, { UseDialogStatePrpos, Cancel } from 'azrmui/hooks/useDialogState';
import DialogEx from 'azrmui/core/Dialogs/DialogEx';
import { makeStyles } from '@material-ui/core/styles';
import DialogTitle from '@material-ui/core/DialogTitle';

const useStyles = makeStyles({
});

export type UseDialogPrpos = UseDialogStatePrpos & {
  title?: string;
  content?: any;
  children?: any;
  closeContent?: any;
};

export default (p : UseDialogPrpos) => {
  const {
    title = '',
    content,
    children,
    closeContent,
    ...useDialogStatePrpos
  } = p;

  const dialogState = useDialogState(useDialogStatePrpos);

  const {
    // open,
    exited,
    dialogProps,
  } = dialogState[0];

  const render = () => !exited && (
    <DialogEx
      fullHeight
      dialogProps={dialogProps}
    >
      {title && <DialogTitle>{title}</DialogTitle>}
      {content && (
        <DialogContent>
          {content}
        </DialogContent>
      )}
      {children}
      <DialogActions>
        {closeContent && (
          <Button
            onClick={dialogState[1].handleClose}
          >
            {closeContent}
          </Button>
        )}
      </DialogActions>
    </DialogEx>
  );

  return {
    ...dialogState[0],
    ...dialogState[1],
    render,
  };
};
