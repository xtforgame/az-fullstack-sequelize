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
import DateRange from 'azrmui/core/Range/DateTime/DateRange';
import TimeRange from 'azrmui/core/Range/DateTime/TimeRange';
import DateTimeRange from 'azrmui/core/Range/DateTime/DateTimeRange';
import {
  normalizeDateTime,
  getDateRangeDisplayFunc,
} from 'azrmui/core/Range/DateTime/utils';
import ColorDialog from './ColorDialog';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    overflowX: 'auto',
  },
}));

export default (props) => {
  const classes = useStyles();
  const {
    title = 'Color',
    value = ['黑色', { r: 0, g: 0, b: 0, a: 1 }],
    onChange,
    buttonProps,
    rangeInpuProps = {
      PickerProps: { ampm: false },
      Picker1Props: { initialFocusedDate: moment().startOf('day') },
      Picker2Props: { initialFocusedDate: moment().startOf('day')/* .add(18, 'hours') */ },
    },
  } = props;

  return (
    <FormDialogInput
      label={title}
      value={value}
      displayValue={value => (
        <div style={{ display: 'flex' }}>
          <div style={{ width: '50%', textAlign: 'center' }}>
            {value[0]}
          </div>
          <div style={{ width: '50%', border: '1px solid black', backgroundColor: `rgba(${value[1].r}, ${value[1].g}, ${value[1].b}, ${value[1].a})` }} />
        </div>
      )}
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
        <ColorDialog
          title={title != null ? title : label}
          normalize={normalizeDateTime}
          open={open}
          value={value}
          RangeInput={DateTimeRange}
          rangeInpuProps={rangeInpuProps}
          {...dialogProps}
          onChange={onChange}
          onClose={handleClose}
        />
      )}
    />
  );
};
