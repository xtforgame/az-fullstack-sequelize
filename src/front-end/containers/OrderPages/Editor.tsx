import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { useQuery, gql } from '@apollo/client';
import useStateWithError from 'azrmui/hooks/useStateWithError';
/* eslint-disable react/sort-comp */
import axios from 'axios';
import path from 'path';
import List from '@material-ui/core/List';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
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
import {
  orderStates,
  orderStateNameFunc,
  orderPayWayNameFunc,
} from 'common/domain-logic/constants/order';
import {
  Order, Campaign, Product, ShippingFee, calcOrderInfo,
  toShippingFeeTableMap,
  ShippingFeeTableMap, OrderInfo,
} from 'common/domain-logic/gql-helpers';
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
import ProductDetail from './DetailTable/ProductDetail';
import OrderDetail from './DetailTable/OrderDetail';
import BuyerDetail from './DetailTable/BuyerDetail';
import RecipientDetail from './DetailTable/RecipientDetail';
import ActionsPaper from './ActionsPaper';

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
  container: {
    top: 0,
    position: 'relative',
  },
  actionsPaperContainer: {
    top: 120,
    right: 40,
    position: 'fixed',
  }
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
    refresh,
    shippingFeeTableMap,
  } = props;

  const [orderInfo, setOrderInfo] = useState<OrderInfo | undefined>();

  useEffect(() => {
    if (editingData && shippingFeeTableMap) {
      setOrderInfo(calcOrderInfo(editingData, shippingFeeTableMap));
    } else {
      setOrderInfo(undefined);
    }
  }, [editingData, shippingFeeTableMap ]);

  const isCreating = !editingData;

  const classes = useStyles();
  const [refreshCount, setRefreshCount] = useState(0);

  const [group, setGroup, groupError, setGroupError] = useStateWithError(isCreating ? null : editingData.group);
  const [
    [name, setName, nameError, setNameError],
    nameInput,
  ] = useTextField(isCreating ? '' : editingData.name, '', {
    label: '商品名稱',
    required: true,
  });
  const [
    [selectedState, setSelectedState, selectedStateError, setSelectedStateError],
    selectedStateInput,
  ] = useFormSelect(isCreating ? orderStates[0].id : editingData.state, '', {
    label: '訂單狀態',
    valueKey: 'id',
    labelKey: 'name',
    items: orderStates,
  });

  const push = useRouterPush();
  const submit = async () => {
    let errorOccurred = false;

    if (errorOccurred) {
      return;
    }
    const data = {
      state: selectedStateInput,
    };
    try {
      // await axios({
      //   method: 'patch',
      //   url: `api/products/${editingData.id}`,
      //   data,
      // });
      push('/order');
    } catch (error) {
      alert(`更新失敗：${error.message}`);
    }
  };

  if (!orderInfo) {
    return null;
  }

  console.log('orderInfo :', orderInfo);
  console.log('editingData :', editingData);
  return (
    <React.Fragment>
      <div className={classes.container}>
        <DialogTitle id="alert-dialog-title">
          編輯訂單
        </DialogTitle>
        <DialogContent>
          <div className={classes.flexContainer}>
            <div className={classes.flex1}>
              <List>
                <ListItem>
                  <ListItemText
                    primary="訂單編號"
                    secondary={editingData?.id}
                  />
                  <ListItemSecondaryAction>
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="購買人"
                    secondary={editingData?.data?.orderData?.order?.buyer?.email}
                  />
                  <ListItemSecondaryAction>
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="付款方式"
                    secondary={orderPayWayNameFunc(editingData?.payWay)}
                  />
                  <ListItemSecondaryAction>
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="訂單狀態"
                    secondary={orderStateNameFunc(editingData?.state)}
                  />
                  <ListItemSecondaryAction>
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="發票號碼"
                    secondary={editingData?.invoiceNumber}
                  />
                  <ListItemSecondaryAction>
                    {
                      !editingData?.invoiceNumber && editingData?.state && editingData?.state !== 'unpaid' && (
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={async () => {
                            await axios({
                              method: 'post',
                              url: `/api/upload-invoice/${editingData?.id}`,
                            })
                            .then(() => {
                              refresh();
                            });
                          }}
                        >
                          手動上傳發票
                        </Button>
                      )
                    }
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
              {/* <FormSpace variant="content1" />
              {selectedStateInput.render()} */}
              <FormSpace variant="content1" />
              <OrderDetail row={editingData} />
              <RecipientDetail row={editingData} />
              <BuyerDetail row={editingData} />
              <ProductDetail row={editingData} orderInfo={orderInfo} onRefresh={refresh} />
              <FormSpace variant="content1" />
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { push('/order'); }} color="primary">
            返回
          </Button>
          <Button variant="contained" onClick={submit} color="primary">
            更新
          </Button>
        </DialogActions>
        <div className={classes.actionsPaperContainer}>
          <ActionsPaper row={editingData} onRefresh={refresh} assign={() => {}} />
        </div>
      </div>
    </React.Fragment>
  );
};
