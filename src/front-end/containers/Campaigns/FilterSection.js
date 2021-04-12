import React, { useState } from 'react';
import useStateWithError from 'azrmui/hooks/useStateWithError';
import { makeStyles } from '@material-ui/core/styles';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import { FormDatePicker, FormFieldButtonSelect, FormTextField, FormSpace } from 'azrmui/core/FormInputs';
import MenuItem from '@material-ui/core/MenuItem';

import DateRangeInput from './DateRangeInput';
import TagsAutocomplete from './TagsAutocomplete';

import BasicSection from '~/components/Section/Basic';

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

export default () => {
  const classes = useStyles();
  const [searchText, setSearchText, searchTextError, setSearchTextError] = useStateWithError('');
  const [dateRange, setDateRange] = useState([null, null]);

  const [selectedState, setSelectedState] = useState({ id: 0, name: '<全部>' });
  const [stateArray, setStateArray] = useState([
    { id: 0, name: '<全部>' },
    { id: 1, name: '已付款' },
    { id: 2, name: '已取消' },
    { id: 3, name: '已退款' },
    { id: 4, name: '已出貨' },
    { id: 5, name: '已完成' },
  ]);
  const getStateMenuItem = ({
    option,
    // selectedOption,
    // isSelected,
    handleOptionClick,
  }) => (
    <MenuItem
      key={option.id}
      selected={option.id === (selectedState && selectedState.id)}
      onClick={handleOptionClick}
    >
      {`${option.name}`}
    </MenuItem>
  );
  const handleStateMenuItemClick = (event, exEvent, i) => {
    setSelectedState(exEvent);
  };

  return (
    <BasicSection withMaxWith>
      <DialogTitle id="alert-dialog-title">搜尋條件</DialogTitle>
      <DialogContent>
        <div className={classes.flexContainer}>
          <div className={classes.flex1}>
            <FormTextField
              label="搜尋文字"
              error={!!searchTextError}
              helperText={searchTextError}
              // label={label}
              // onKeyPress={handleEnterForTextField}
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              margin="dense"
              fullWidth
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
              label="訂單狀態"
              value={selectedState}
              options={stateArray}
              getMenuItem={getStateMenuItem}
              onChange={handleStateMenuItemClick}
              toInputValue={state => (state && `${state.name}`) || '<未選取>'}
              toButtonValue={state => `${(state && state.name) || '<未選取>'}`}
              fullWidth
              margin="dense"
            />
          </div>
          <div className={classes.flex1}>
            <TagsAutocomplete
              label="搜尋包含商品"
              error={!!searchTextError}
              helperText={searchTextError}
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
              error={!!searchTextError}
              helperText={searchTextError}
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
