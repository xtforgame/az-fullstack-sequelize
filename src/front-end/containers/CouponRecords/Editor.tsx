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

  const [group, setGroup, groupError, setGroupError] = useStateWithError(isCreating ? null : editingData.group);
  const [
    [name, setName, nameError, setNameError],
    nameInput,
  ] = useTextField(isCreating ? '' : editingData.name, '', {
    label: '會員名稱',
    required: true,
  });
  const [
    [customId, setCustomId, customIdError, setCustomIdError],
    customIdInput,
  ] = useTextField(isCreating ? '' : editingData.customId, '', {
    label: '會員貨號',
    // required: true,
  });
  const [
    [size, setSize, sizeError, setSizeError],
    sizeInput,
  ] = useTextField(isCreating ? '' : editingData.size, '', {
    label: '尺寸',
    required: true,
  });
  const [
    [colorCode, setColorCode, colorCodeError, setColorCodeError],
    colorCodeInput,
  ] = useTextField(isCreating ? '' : editingData.colorCode, '', {
    label: '顏色代號(產生會員編號用)',
    required: true,
  });
  const [colorInfo, setColorInfo] = useStateWithError(getDefaultColor(editingData));
  const [price, setPrice, priceError, setPriceError] = useStateWithError(isCreating ? 0 : editingData.price);
  const [
    [priority, setPriority, priorityError, setPriorityError],
    priorityInput,
  ] = useNumberInput(isCreating ? 0 : (editingData.priority || 0), '', {
    label: '順序(數字大的在上)',
    required: true,
  });
  const [
    [sizeChart, setSizeChart, sizeChartError, setSizeChartError],
    sizeChartInput,
  ] = useTextField(isCreating ? '' : editingData.sizeChart, '', {
    label: '尺寸表',
    placeholder: `格式:\n尺寸名1:數值1\n尺寸名2:數值2`,
    required: true,
    margin: 'dense',
    fullWidth: true,
    multiline: true,
    rows: 5,
    rowsMax: 20,
  });
  const [materials, setMaterials, materialsError, setMaterialsError] = useStateWithError(isCreating ? '' : editingData.materials);
  const [description, setDescription, descriptionError, setDescriptionError] = useStateWithError(isCreating ? '' : editingData.description);
  const [weight, setWeight, weightError, setWeightError] = useStateWithError(isCreating ? '' : editingData.weight);
  const [ordering, setOrdering, orderingError, setOrderingError] = useStateWithError(isCreating ? 0 : editingData.ordering);
  const [instock, setInstock, instockError, setInstockError] = useStateWithError(isCreating ? 0 : editingData.instock);
  const [orderQuota, setOrderQuota, orderQuotaError, setOrderQuotaError] = useStateWithError(isCreating ? 0 : editingData.orderQuota);
  const [
    [disabled, setDisabled, disabledError, setDisabledError],
    disabledInput,
  ] = useSwitch(isCreating ? false : editingData.disabled, '', {
    labelProps: {
      labelPlacement: 'end',
    },
  });
  
  const [
    [isLimit, setIsLimit, isLimitError, setIsLimitError],
    isLimitInput,
  ] = useCheckbox(isCreating ? false : editingData.isLimit, '', {
    label: '限量會員',
    labelProps: {
      labelPlacement: 'end',
    },
  });

  const [
    [soldout, setSoldout, soldoutError, setSoldoutError],
    soldoutInput,
  ] = useCheckbox(isCreating ? false : editingData.soldout, '', {
    label: '斷貨',
    labelProps: {
      labelPlacement: 'end',
    },
  });

  console.log('group :', group);
  const [imageInfos, setImageInfos] = useState(isCreating ? [] : editingData.pictures);

  const push = useRouterPush();
  const submit = async () => {
    
  };

  return (
    <React.Fragment>
      <DialogTitle id="alert-dialog-title">
        {isCreating ? '新增' : '編輯'}
        會員
      </DialogTitle>
      <DialogContent>
        <div className={classes.flexContainer}>
          <div className={classes.flex1}>
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => { push('/member'); }} color="primary">
          返回
        </Button>
        <Button variant="contained" onClick={submit} color="primary">
          {isCreating ? '新增' : '更新'}
        </Button>
      </DialogActions>
    </React.Fragment>
  );
};
