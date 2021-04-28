import React, { useState } from 'react';
import useStateWithError from 'azrmui/hooks/useStateWithError';
import { makeStyles } from '@material-ui/core/styles';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import { FormDatePicker, FormFieldButtonSelect, FormTextField, FormSpace } from 'azrmui/core/FormInputs';
import MenuItem from '@material-ui/core/MenuItem';

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
    maxWidth: 800,
    padding: 24,
    flex: 1,
  },
}));

export default () => {
  const classes = useStyles();
  const [
    [searchText, setSearchText, searchTextError, setSearchTextError], searchInput,
  ] = useTextField('', '', {
    label: '搜尋文字',
  });

  const [
    [dateRange, setDateRange], selectDateRange,
  ] = useDateRange([null, null], '', {
    title: '選取時間範圍',
  });

  const [
    [selectedState, setSelectedState], selectInput,
  ] = useFormSelect('', '', {
    label: '訂單狀態',
    items: [
      { value: 0, label: '<全部>' },
      { value: 1, label: '已付款' },
      { value: 2, label: '已取消' },
      { value: 3, label: '已退款' },
      { value: 4, label: '已出貨' },
      { value: 5, label: '已完成' },
    ],
  });

  return (
    <BasicSection withMaxWith>
      <DialogTitle id="alert-dialog-title">搜尋條件</DialogTitle>
      <DialogContent>
        <div className={classes.flexContainer}>
          <div className={classes.flex1}>
            {searchInput.render()}
            <FormSpace variant="content1" />
            {selectDateRange.render()}
            <FormSpace variant="content1" />
            {/* selectInput.render() */}
          </div>
          <div className={classes.flex1}>
            <TagsAutocomplete
              label="搜尋包含商品"
              // label={label}
              // onKeyPress={handleEnterForTextField}
              // value={searchText}
              // onChange={e => setSearchText(e.target.value)}
              margin="dense"
              fullWidth
            />
            <FormSpace variant="content1" />
            <TagsAutocomplete
              label="搜尋活動"
              // label={label}
              // onKeyPress={handleEnterForTextField}
              // value={searchText}
              // onChange={e => setSearchText(e.target.value)}
              margin="dense"
              fullWidth
            />
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={() => {}} color="primary">
          搜尋
        </Button>
      </DialogActions>
    </BasicSection>
  );
};
