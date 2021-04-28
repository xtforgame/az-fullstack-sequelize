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
import useStateWithError from 'azrmui/hooks/useStateWithError';
/* eslint-disable react/sort-comp */
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
// import { getDefaultBeforeDaysConfig, makeDaysFilter } from '~/utils/beforeDaysHelper';
// import { compareString, formatTime } from '~/utils/tableUtils';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import {
  FormNumberInput, FormOutlinedSelect, FormFieldButtonSelect, FormTextField, FormSpace,
} from 'azrmui/core/FormInputs';
import DateRangeInput from '~/components/DateRangeInput';
import useRouterPush from '~/hooks/useRouterPush';
import TagsAutocomplete from '~/components/TagsAutocomplete';
import useTextField from '~/components/hooks/inputs/useTextField';
import useFormSelect from '~/components/hooks/inputs/useFormSelect';
import useDateRange from '~/components/hooks/inputs/useDateRange';
import DiscountInput from './DiscountInput';
import {
  campaignTypes,
  campaignStates,
} from '../constants';

const useStyles = makeStyles(theme => ({
  flexContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    flexWrap: 'wrap',
  },
  flex1: {
    maxWidth: 800,
    padding: 24,
    flex: 1,
  },
}));

export default (props) => {
  const {
    editingData,
  } = props;

  const isCreating = !editingData;

  const classes = useStyles();

  const [
    [name, setName, nameError, setNameError],
    nameInput,
  ] = useTextField(isCreating ? '' : editingData.name, '', {
    label: '活動名稱',
    required: true,
  });
  const [
    [selectedType, setSelectedType, selectedTypeError, setSelectedTypeError],
    selectedTypeInput,
  ] = useFormSelect(isCreating ? campaignTypes[0].id : editingData.type, '', {
    label: '活動類型',
    valueKey: 'id',
    labelKey: 'name',
    items: campaignTypes,
  });

  const [
    [dateRange, setDateRange],
    selectDateRange,
  ] = useDateRange(isCreating ? [null, null] : [editingData.start, editingData.end], '', {
    title: '選取時間範圍',
  });

  const [
    [selectedState, setSelectedState, selectedStateError, setSelectedStateError],
    selectedStateInput,
  ] = useFormSelect(isCreating ? campaignStates[0].id : editingData.state, '', {
    label: '狀態',
    valueKey: 'id',
    labelKey: 'name',
    items: campaignStates,
  });

  const [discount, setDiscount] = useState(editingData && editingData.data && editingData.data.discount);

  const push = useRouterPush();
  const submit = async () => {
    let errorOccurred = false;
    if (!name) {
      setNameError('請輸入活動名稱');
      errorOccurred = true;
    }
    if (!selectedType) {
      setSelectedTypeError('請選擇活動類型');
      errorOccurred = true;
    }
    if (!selectedState) {
      setSelectedStateError('請選擇活動狀態');
      errorOccurred = true;
    }
    if (errorOccurred) {
      return;
    }
    const data = {
      name,
      type: selectedType,
      state: selectedState,
      start: dateRange[0] && moment(dateRange[0]).valueOf(),
      end: dateRange[1] && moment(dateRange[1]).valueOf(),
      data: {
        ...(editingData && editingData.data),
        discount,
      },
    };
    try {
      if (isCreating) {
        await axios({
          method: 'post',
          url: 'api/campaigns',
          data,
        });
      } else {
        await axios({
          method: 'patch',
          url: `api/campaigns/${editingData.id}`,
          data,
        });
      }
      push('/campaign');
    } catch (error) {
      alert(`更新失敗：${error.message}`);
    }
  };

  return (
    <React.Fragment>
      <DialogTitle id="alert-dialog-title">
        {isCreating ? '新增' : '編輯'}
        活動
      </DialogTitle>
      <DialogContent>
        <div className={classes.flexContainer}>
          <div className={classes.flex1}>
            {nameInput.render()}
            <FormSpace variant="content1" />
            {selectedTypeInput.render()}
            <FormSpace variant="content1" />
            {selectDateRange.render()}
            <FormSpace variant="content1" />
            {selectedStateInput.render()}
            <FormSpace variant="content1" />
            <Divider />
            <FormSpace variant="content1" />
            <DiscountInput
              value={discount}
              onChange={setDiscount}
              selectedType={selectedType}
            />
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => { push('/campaign'); }} color="primary">
          返回
        </Button>
        <Button variant="contained" onClick={submit} color="primary">
          {isCreating ? '新增' : '更新'}
        </Button>
      </DialogActions>
    </React.Fragment>
  );
};
