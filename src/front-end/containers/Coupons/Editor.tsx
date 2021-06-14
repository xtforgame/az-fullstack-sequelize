/* This is an example snippet - you should consider tailoring it
to your service.
*/
/*
  Add these to your `package.json`:
    "apollo-boost": "^0.3.1",
    "graphql": "^14.2.1",
    "graphql-tag": "^2.10.0",
    "react-apollo": "^2.5.5"
*/
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { useQuery, gql } from '@apollo/client';
import useStateWithError from 'azrmui/hooks/useStateWithError';
/* eslint-disable react/sort-comp */
import axios from 'axios';
import path from 'path';
import Chip from '@material-ui/core/Chip';
import { makeStyles } from '@material-ui/core/styles';
// import { getDefaultBeforeDaysConfig, makeDaysFilter } from '~/utils/beforeDaysHelper';
// import { compareString, formatTime } from '~/utils/tableUtils';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import {
  FormNumberInput, FormImagesInput, FormDatePicker, FormFieldButtonSelect, FormTextField, FormSpace,
} from 'azrmui/core/FormInputs';
import { createHandleUploadFunction } from 'azrmui/core/FormInputs/FormImagesInput';
import ColorInput from '~/components/ColorInput';
import DateRangeInput from '~/components/DateRangeInput';
import useRouterPush from '~/hooks/useRouterPush';
import FormAutocomplete from '~/components/FormAutocomplete';
import LoadingMask from '~/components/TableShared/LoadingMask';
import useTextField from '~/components/hooks/inputs/useTextField';
import useNumberInput from '~/components/hooks/inputs/useNumberInput';
import useFormSelect from '~/components/hooks/inputs/useFormSelect';
import useDateRange from '~/components/hooks/inputs/useDateRange';
import useSwitch from '~/components/hooks/inputs/useSwitch';
import useCheckbox from '~/components/hooks/inputs/useCheckbox';
import UserSelector from './UserSelector';

const useStyles = makeStyles(theme => ({
  flexContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    flexWrap: 'wrap',
  },
  flex1: {
    maxWidth: 1200,
    padding: 24,
    flex: 1,
  },
}));

const handleUpload = createHandleUploadFunction('/api/files');

function isInteger(str) {
  return !Number.isNaN(str) && !Number.isNaN(parseInt(str));
}

function isNumber(str) {
  return !Number.isNaN(str) && !Number.isNaN(parseFloat(str));
}

const getDefaultColor = (editingData) => {
  if (editingData && editingData.colorName && editingData.color) {
    return [editingData.colorName, JSON.parse(editingData.color)];
  }
  return ['黑色', { r: 0, g: 0, b: 0, a: 1 }];
};

export default (props) => {
  const {
    editingData,
  } = props;

  const isCreating = !editingData;

  const classes = useStyles();
  const [refreshCount, setRefreshCount] = useState(0);

  const [
    [isDeduct, setIsDeduct],
    isDeductInput,
  ] = useFormSelect('', '', {
    label: '增加/扣除',
    items: [
      { value: 0, label: '增加' },
      { value: 1, label: '扣除' },
    ],
    required: true,
  });
  const [
    [amount, setAmount, amountError, setAmountError],
    amountInput,
  ] = useNumberInput(isCreating ? 0 : (editingData.amount || 0), '', {
    label: '價格',
    required: true,
  });
  const [
    [memo, setMemo, memoError, setMemoError],
    memoInput,
  ] = useTextField(isCreating ? '' : editingData.memo, '', {
    label: '備註',
    placeholder: ``,
    required: true,
    margin: 'dense',
    fullWidth: true,
    multiline: true,
    rows: 5,
    rowsMax: 20,
  });

  const push = useRouterPush();
  const submit = async () => {
    push('/coupon');
  };

  return (
    <React.Fragment>
      <DialogTitle id="alert-dialog-title">
        {isCreating ? '新增' : '編輯'}
        購物金
      </DialogTitle>
      <DialogContent>
        <div className={classes.flexContainer}>
          <div className={classes.flex1}>
            <UserSelector />
            <FormSpace variant="content1" />
            {isDeductInput.render()}
            <FormSpace variant="content1" />
            {amountInput.render()}
            <FormSpace variant="content1" />
            {memoInput.render()}
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => { push('/coupon'); }} color="primary">
          返回
        </Button>
        <Button variant="contained" onClick={submit} color="primary">
          {isCreating ? '新增' : '更新'}
        </Button>
      </DialogActions>
    </React.Fragment>
  );
};
