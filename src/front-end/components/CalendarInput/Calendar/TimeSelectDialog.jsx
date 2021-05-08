/* eslint-disable react/prop-types, react/forbid-prop-types */
import React, { useState } from 'react';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import DialogContent from '@material-ui/core/DialogContent';
import ConfirmDialog from 'azrmui/core/Dialogs/ConfirmDialog';
import MenuItem from '@material-ui/core/MenuItem';
import { FormSpace, FormFieldButtonSelect } from 'azrmui/core/FormInputs';

export default (props) => {
  const {
    label,
    value,
    i18nNs = [],
    onClose = () => undefined,
    onExited,
    selectedEvent,
    stepMinutes = 30,
    ...rest
  } = props;

  const [{
    options,
    optionMap,
    timestampToString,
  }] = useState(() => {
    const momentTimes = [];
    const options = [];
    const optionMap = {};
    const timestampToString = {};
    let time = moment(selectedEvent.start);
    const end = moment(selectedEvent.end);
    while (time.valueOf() <= end.valueOf()) {
      momentTimes.push(time);
      const key = time.format('HH:mm');
      options.push(key);
      optionMap[key] = time;
      timestampToString[time.valueOf()] = key;
      time = moment(time).add(stepMinutes, 'minutes');
    }
    return {
      options,
      optionMap,
      timestampToString,
    };
  });

  const normalize = ([t1, t2]) => {
    if (!t1 || !t2) {
      return [t1, t2];
    }
    if (optionMap[t1].valueOf() > optionMap[t2].valueOf()) {
      return [t2, t1];
    }
    return [t1, t2];
  };

  const [initLb, initUb] = normalize([
    (props.value && timestampToString[props.value[0]]) || null,
    (props.value && timestampToString[props.value[1]]) || null,
  ]);

  const [lowerBound, setLowerBound] = useState(initLb);
  const [upperBound, setUpperBound] = useState(initUb);

  const { t } = useTranslation(['builtin-components']);

  const setRange = (lb, ub) => {
    const [nln, nub] = normalize([lb, ub]);
    setLowerBound(nln);
    setUpperBound(nub);
  };

  const handleClose = (_result) => {
    let result = _result;
    if (result === true) {
      const lb = lowerBound || options[0];
      const ub = upperBound || options[options.length - 1];
      result = [optionMap[lb].valueOf(), optionMap[ub].valueOf()];
    } else {
      result = undefined;
    }
    onClose(result);
  };

  const getMenuItem = ({
    option,
    // selectedOption,
    index,
    isSelected,
    handleOptionClick,
  }) => (
    <MenuItem
      key={option}
      selected={isSelected}
      value={option}
      onClick={handleOptionClick}
    >
      {option}
    </MenuItem>
  );

  return (
    <ConfirmDialog
      {...rest}
      onClose={handleClose}
      dialogProps={{ onExited }}
      buttonTexts={{
        yes: t('confirmOK'),
        no: t('confirmCancel'),
      }}
    >
      <DialogContent>
        閒置空間：
        {selectedEvent && selectedEvent.desc}
        <FormSpace variant="content1" />
        <FormFieldButtonSelect
          id="lower-boundr"
          label="開始時間"
          value={lowerBound}
          options={options}
          getMenuItem={getMenuItem}
          onChange={(e, v) => setRange(v, upperBound)}
          toInputValue={value => value}
          toButtonValue={value => value}

          // label="類型"
          margin="dense"
          fullWidth
          style={{ textAlign: 'center' }}
        />
        <FormSpace variant="content1" />
        <FormFieldButtonSelect
          id="upper-bound"
          label="結束時間"
          value={upperBound}
          options={options}
          getMenuItem={getMenuItem}
          onChange={(e, v) => setRange(lowerBound, v)}
          toInputValue={value => value}
          toButtonValue={value => value}

          // label="類型"
          margin="dense"
          fullWidth
          style={{ textAlign: 'center' }}
        />
      </DialogContent>
    </ConfirmDialog>
  );
};
