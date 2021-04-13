/* eslint-disable no-param-reassign */
import React, { useState } from 'react';
import moment from 'moment';
import { makeStyles } from '@material-ui/core/styles';
import FormDialogInput from 'azrmui/core/FormInputs/FormDialogInput';
import {
  getDateDisplayFuncFromProps,
  getTimeDisplayFuncFromProps,
  getDateTimeDisplayFuncFromProps,
} from 'azrmui/core/FormInputs/FormDateTimePicker/utils';
import RangeDialog from 'azrmui/core/Range/RangeDialog';
import DateRange from 'azrmui/core/Range/DateTime/DateRange';
import TimeRange from 'azrmui/core/Range/DateTime/TimeRange';
import DateTimeRange from 'azrmui/core/Range/DateTime/DateTimeRange';
import {
  normalizeDateTime,
  getDateRangeDisplayFunc,
} from 'azrmui/core/Range/DateTime/utils';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    overflowX: 'auto',
  },
}));

export default (props) => {
  const classes = useStyles();
  const {
    title = 'DateRange',
    value = [null, null],
    onChange,
    buttonProps,
    rangeInpuProps = {
      PickerProps: { ampm: false },
      Picker1Props: { initialFocusedDate: moment().startOf('day') },
      Picker2Props: { initialFocusedDate: moment().startOf('day').add(18, 'hours') },
    },
  } = props;
  return (
    <FormDialogInput
      label={title}
      value={value}
      displayValue={getDateRangeDisplayFunc(getDateTimeDisplayFuncFromProps(props))}
      onChange={onChange}
      buttonProps={{
        fullWidth: true,
        ...buttonProps,
      }}
      renderDialog={({
        label,
        title,
        open,
        handleClose,
        value,
        dialogProps,
      }) => (
        <RangeDialog
          title={title != null ? title : label}
          normalize={normalizeDateTime}
          open={open}
          value={value}
          RangeInput={DateTimeRange}
          rangeInpuProps={rangeInpuProps}
          {...dialogProps}
          onClose={handleClose}
        />
      )}
    />
  );
};
