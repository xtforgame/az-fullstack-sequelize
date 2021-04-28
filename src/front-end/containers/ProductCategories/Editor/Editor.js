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
import Chip from '@material-ui/core/Chip';
import { makeStyles } from '@material-ui/core/styles';
// import { getDefaultBeforeDaysConfig, makeDaysFilter } from '~/utils/beforeDaysHelper';
// import { compareString, formatTime } from '~/utils/tableUtils';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import {
  FormNumberInput, FormSwitch, FormTextField, FormSpace,
} from 'azrmui/core/FormInputs';
import DateRangeInput from '~/components/DateRangeInput';
import useRouterPush from '~/hooks/useRouterPush';
import FormAutocomplete from '~/components/FormAutocomplete';
import LoadingMask from '~/components/EnhancedTable/LoadingMask';

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

function isInteger(str) {
  return !Number.isNaN(str) && !Number.isNaN(parseInt(str));
}

function isNumber(str) {
  return !Number.isNaN(str) && !Number.isNaN(parseFloat(str));
}

export default (props) => {
  const {
    editingData,
  } = props;

  const isCreating = !editingData;

  const classes = useStyles();
  const [refreshCount, setRefreshCount] = useState(0);

  const [name, setName, nameError, setNameError] = useStateWithError(isCreating ? '' : editingData.name);
  const [priority, setPriority, priorityError, setPriorityError] = useStateWithError(isCreating ? 0 : editingData.priority);
  const [active, setActive, activeError, setActiveError] = useStateWithError(isCreating ? false : editingData.active);

  const push = useRouterPush();
  const submit = async () => {
    let errorOccurred = false;
    if (!name) {
      setNameError('請輸入商品分類名稱');
      errorOccurred = true;
    }

    if (!priority || !isInteger(priority)) {
      setPriorityError('錯誤的順序');
      errorOccurred = true;
    }

    if (errorOccurred) {
      return;
    }
    const data = {
      name,
      priority,
      active,
    };
    try {
      if (isCreating) {
        await axios({
          method: 'post',
          url: 'api/product-categories',
          data,
        });
      } else {
        await axios({
          method: 'patch',
          url: `api/product-categories/${editingData.id}`,
          data,
        });
      }
      push('/product-category');
    } catch (error) {
      alert(`更新失敗：${error.message}`);
    }
  };

  console.log('active :', active);

  return (
    <React.Fragment>
      <DialogTitle id="alert-dialog-title">
        {isCreating ? '新增' : '編輯'}
        商品分類
      </DialogTitle>
      <DialogContent>
        <div className={classes.flexContainer}>
          <div className={classes.flex1}>
            <FormSwitch
              label={active ? '顯示' : '不顯示'}
              // error={!!activeError}
              // helperText={activeError}
              // label={label}
              // onKeyPress={handleEnterForTextField}
              checked={active}
              onChange={e => setActive(!active)}
              labelProps={{ labelPlacement: 'end' }}
              margin="dense"
            />
            <FormSpace variant="content1" />
            <FormTextField
              label="分類名稱"
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
            <FormNumberInput
              label="順序"
              error={!!priorityError}
              helperText={priorityError}
              // label={label}
              // onKeyPress={handleEnterForTextField}
              value={priority}
              onChange={e => setPriority(e.target.value)}
              margin="dense"
              fullWidth
            />
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => { push('/product-category'); }} color="primary">
          返回
        </Button>
        <Button variant="contained" onClick={submit} color="primary">
          {isCreating ? '新增' : '更新'}
        </Button>
      </DialogActions>
    </React.Fragment>
  );
};
