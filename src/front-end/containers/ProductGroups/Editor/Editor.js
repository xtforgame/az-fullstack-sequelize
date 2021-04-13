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
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import {
  FormDatePicker, FormFieldButtonSelect, FormTextField, FormSpace,
} from 'azrmui/core/FormInputs';
import DateRangeInput from '~/components/DateRangeInput';
import useRouterPush from '~/hooks/useRouterPush';
import TagsAutocomplete from '~/components/TagsAutocomplete';

import {
  productGroupTypeInfo,
  productGroupTypeNameMap,
  productGroupTypeNameFunc,
  productGroupTypes,
  productGroupStateInfo,
  productGroupStateNameMap,
  productGroupStateNameFunc,
  productGroupStates,
} from '../constants';

const useStyles = makeStyles(theme => ({
  flexContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    flexWrap: 'wrap',
  },
  flex1: {
    maxWidth: 400,
    flex: 1,
  },
}));

export default (props) => {
  const {
    editingData,
  } = props;

  const isCreating = !editingData;

  const classes = useStyles();

  const [name, setName, nameError, setNameError] = useStateWithError(isCreating ? '' : editingData.name);
  const [selectedType, setSelectedType, selectedTypeError, setSelectedTypeError] = useStateWithError(isCreating ? productGroupTypes[0] : { id: editingData.type, name: productGroupTypeNameFunc(editingData.type) });
  const handleTypeMenuItemClick = (event, exEvent, i) => {
    setSelectedType(exEvent);
  };

  const [dateRange, setDateRange] = useState(isCreating ? [null, null] : [editingData.start, editingData.end]);

  const [selectedState, setSelectedState, selectedStateError, setSelectedStateError] = useStateWithError(isCreating ? productGroupStates[0] : { id: editingData.state, name: productGroupStateNameFunc(editingData.state) });
  const handleStateMenuItemClick = (event, exEvent, i) => {
    setSelectedState(exEvent);
  };

  const push = useRouterPush();
  const submit = async () => {
    let errorOccurred = false;
    if (!name) {
      setNameError('請輸入活動名稱');
      errorOccurred = true;
    }
    if (!productGroupTypeNameMap[selectedType.id]) {
      setSelectedTypeError('請選擇活動類型');
      errorOccurred = true;
    }
    if (!productGroupStateNameMap[selectedState.id]) {
      setSelectedStateError('請選擇活動類型');
      errorOccurred = true;
    }
    if (errorOccurred) {
      return;
    }
    const data = {
      name,
      type: selectedType.id,
      state: selectedState.id,
      start: dateRange[0] && moment(dateRange[0]).valueOf(),
      end: dateRange[1] && moment(dateRange[1]).valueOf(),
    };
    try {
      if (isCreating) {
        await axios({
          method: 'post',
          url: 'api/productGroups',
          data,
        });
      } else {
        await axios({
          method: 'patch',
          url: `api/productGroups/${editingData.id}`,
          data,
        });
      }
      push('/product-group');
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
            <FormTextField
              label="活動名稱"
              error={!!nameError}
              helperText={nameError}
              // label={label}
              // onKeyPress={handleEnterForTextField}
              value={name}
              onChange={e => setName(e.target.value)}
              margin="dense"
              fullWidth
            />
            <FormSpace variant="content1" />
            <FormFieldButtonSelect
              id="type-selector"
              label="活動類型"
              error={!!selectedTypeError}
              helperText={selectedTypeError}
              value={selectedType}
              options={productGroupTypes}
              onChange={handleTypeMenuItemClick}
              toInputValue={v => (v && `${v.name}`) || '<未選取>'}
              toButtonValue={v => `${(v && v.name) || '<未選取>'}`}
              fullWidth
              margin="dense"
            />
            <FormSpace variant="content1" />
            {/* <FormDatePicker
              label="搜尋文字"
              margin="dense"
              fullWidth
            />
            <FormSpace variant="content1" /> */}
            <DateRangeInput
              title="選取時間範圍"
              value={dateRange}
              onChange={setDateRange}
              buttonProps={{
                margin: 'dense',
              }}
            />
            <FormSpace variant="content1" />
            <FormFieldButtonSelect
              id="state-selector"
              label="狀態"
              error={!!selectedStateError}
              helperText={selectedStateError}
              value={selectedState}
              options={productGroupStates}
              onChange={handleStateMenuItemClick}
              toInputValue={v => (v && `${v.name}`) || '<未選取>'}
              toButtonValue={v => `${(v && v.name) || '<未選取>'}`}
              fullWidth
              margin="dense"
            />
            {/* <FormSpace variant="content1" />
            <TagsAutocomplete
              label="搜尋包含商品"
              error={!!nameError}
              helperText={nameError}
              // label={label}
              // onKeyPress={handleEnterForTextField}
              // value={name}
              // onChange={e => setName(e.target.value)}
              margin="dense"
              fullWidth
            />
            <FormSpace variant="content1" />
            <TagsAutocomplete
              label="搜尋活動"
              error={!!nameError}
              helperText={nameError}
              // label={label}
              // onKeyPress={handleEnterForTextField}
              // value={name}
              // onChange={e => setName(e.target.value)}
              margin="dense"
              fullWidth
            /> */}
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => { push('/product-group'); }} color="primary">
          返回
        </Button>
        <Button variant="contained" onClick={submit} color="primary">
          {isCreating ? '新增' : '更新'}
        </Button>
      </DialogActions>
    </React.Fragment>
  );
};
