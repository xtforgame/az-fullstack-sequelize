/* eslint-disable no-param-reassign */
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { useSnackbar } from 'notistack';
import { makeStyles } from '@material-ui/core/styles';
import FormDialogInput from 'azrmui/core/FormInputs/FormDialogInput';
import Dialog from './Dialog';

const useStyles = makeStyles(theme => ({
}));

const displayDateTime = dateTime => moment(dateTime).format('YYYY/MM/DD HH:mm');

export default (props) => {
  const classes = useStyles();
  const {
    value,
    onChange,
    disabled,
  } = props;

  // const { enqueueSnackbar } = useSnackbar();

  const a = Array.isArray(value) ? value : [];
  return (
    <FormDialogInput
      label="期望的休假時間"
      value={value}
      onChange={onChange}
      displayValue={value => (
        <div style={{ maxHeight: 200, overflowY: 'scroll' }}>
          {
            a
            .filter(value => value.selected)
            .map((value, i) => (
              <React.Fragment key={i}>
                {`${displayDateTime(value.start)} - ${displayDateTime(value.end)}`}
                <br />
              </React.Fragment>
            ))
          }
        </div>
      )}
      buttonProps={{
        fullWidth: true,
      }}
      renderDialog={({
        label,
        title,
        open,
        handleClose,
        value,
        dialogProps,
      }) => (
        <Dialog
          title={title != null ? title : label}
          open={open}
          onClose={handleClose}
          value={value}
          fullScreen
          disabled={disabled}
          {...dialogProps}
        />
      )}
    />
  );
};
