/* eslint-disable react/prop-types, react/forbid-prop-types */
import React, { useState } from 'react';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import Divider from '@material-ui/core/Divider';
import DialogContent from '@material-ui/core/DialogContent';
import MenuItem from '@material-ui/core/MenuItem';
import ConfirmDialog from 'azrmui/core/Dialogs/ConfirmDialog';
import useStateWithError from 'azrmui/hooks/useStateWithError';
import {
  FormSpace,
} from 'azrmui/core/FormInputs';
import useEffectIgnoreFirstRun from 'azrmui/hooks/useEffectIgnoreFirstRun';
import Calendar from './Calendar';

export default (props) => {
  const {
    label,
    value,
    onClose = () => undefined,
    onExited,
    disabled,
    ...rest
  } = props;

  const startDate = moment().startOf('day');
  const [events, setEvents, eventsError, setEventsError] = useStateWithError(value);

  useEffectIgnoreFirstRun(() => {
    // setTitle(getTitle(value));
    // setDesc(getDesc(value));
    // setRequiredCompetencies(getRequiredCompetencies(value));
  }, [value]);

  const { t } = useTranslation(['builtin-components']);

  const handleClose = (_result) => {
    let result = _result;
    if (result === true) {
      result = events;
    } else {
      result = undefined;
    }
    onClose(result);
  };

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
      <DialogContent style={{ paddingRight: 8, paddingLeft: 8 }}>
        {/* <FormSpace variant="content1" />
        <ProjectDropdown key="projectSelector" style={{ width: '100%' }} /> */}
        <FormSpace variant="content1" />
        <Calendar
          date={startDate.toDate()}
          value={events}
          onChange={setEvents}
          disabled={disabled}
        />
      </DialogContent>
    </ConfirmDialog>
  );
};
