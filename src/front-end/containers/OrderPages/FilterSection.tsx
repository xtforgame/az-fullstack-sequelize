import React, { useState } from 'react';
import useStateWithError from 'azrmui/hooks/useStateWithError';
import { makeStyles } from '@material-ui/core/styles';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import {
  FormDatePicker, FormFieldButtonSelect, FormTextField, FormSpace,
} from 'azrmui/core/FormInputs';
import MenuItem from '@material-ui/core/MenuItem';
import {
  orderStates,
  orderStateNameFunc,
  orderPayWayNameFunc,

  logisticsTypes,
} from 'common/domain-logic/constants/order';
import DateRangeInput from '~/components/DateRangeInput';
import TagsAutocomplete from '~/components/TagsAutocomplete';
import BasicSection from '~/components/Section/Basic';

import useTextField from '~/components/hooks/inputs/useTextField';
import useFormSelect from '~/components/hooks/inputs/useFormSelect';
import useDateRange from '~/components/hooks/inputs/useDateRange';

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

const orderStateOptions = [{
  id: '',
  name: '全部',
}, ...orderStates];

const logisticsTypeOptions = [{
  id: '',
  name: '全部',
}, ...logisticsTypes];

export type FilterSectionProps = {
  defaultValue: any;
  onChange: Function;
};

export default ({
  defaultValue,
  onChange = () => null,
}: FilterSectionProps) => {
  const classes = useStyles();
  const [
    [searchId, setSearchId, searchIdError, setSearchIdError],
    searchIdInput,
  ] = useTextField((defaultValue && defaultValue.id) || '', '', {
    label: '搜尋ID',
  });
  const [
    [searchText, setSearchText, searchTextError, setSearchTextError],
    searchInput,
  ] = useTextField((defaultValue && defaultValue.searchText) || '', '', {
    label: '搜尋文字',
  });
  // const [searchText, setSearchText, searchTextError, setSearchTextError] = useStateWithError('');
  const [
    [dateRange, setDateRange],
    selectDateRange,
  ] = useDateRange((defaultValue && defaultValue.dateRange) || [null, null], '', {
    title: '選取時間範圍',
  });

  const [
    [state, setState],
    stateInput,
  ] = useFormSelect((defaultValue && defaultValue.state) || '', '', {
    label: '訂單狀態',
    items: orderStateOptions,
    idKey: 'id',
    valueKey: 'id',
    labelKey: 'name',
  });

  const [
    [logistics, setLogistics],
    logisticsInput,
  ] = useFormSelect((defaultValue && defaultValue.logistics) || '', '', {
    label: '貨運類型',
    items: logisticsTypeOptions,
    idKey: 'id',
    valueKey: 'id',
    labelKey: 'name',
  });

  const submit = () => {
    onChange({
      id: searchId,
      searchText,
      dateRange,
      state,
      logistics,
    });
  };

  return (
    <BasicSection withMaxWith>
      <DialogTitle id="alert-dialog-title">搜尋條件</DialogTitle>
      <DialogContent>
        <div className={classes.flexContainer}>
          <div className={classes.flex1}>
            {searchIdInput.render()}
            <FormSpace variant="content1" />
            {searchInput.render()}
            <FormSpace variant="content1" />
            {selectDateRange.render()}
            <FormSpace variant="content1" />
            {stateInput.render()}
            <FormSpace variant="content1" />
            {logisticsInput.render()}
          </div>
          <div className={classes.flex1}>
            <FormSpace variant="content1" />
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={submit} color="primary">
          搜尋
        </Button>
      </DialogActions>
    </BasicSection>
  );
};
