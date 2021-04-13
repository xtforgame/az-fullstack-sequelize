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
  FormNumberInput, FormImagesInput, FormDatePicker, FormFieldButtonSelect, FormTextField, FormSpace,
} from 'azrmui/core/FormInputs';
import DateRangeInput from '~/components/DateRangeInput';
import useRouterPush from '~/hooks/useRouterPush';
import FormAutocomplete from '~/components/FormAutocomplete';
import LoadingMask from '~/components/EnhancedTable/LoadingMask';

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
import { isNullOrUndefined } from 'util';

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

function isInteger(str) {
  if (typeof str !== 'string') return false;
  return !Math.isNaN(str) && !Math.isNaN(parseInt(str));
}

function isNumber(str) {
  if (typeof str !== 'string') return false;
  return !Math.isNaN(str) && !Math.isNaN(parseFloat(str));
}


const CAMPAIGN_LIST_QUERY = gql`
  query CampaignList {
    campaigns(where: {deleted_at: {_is_null: true}}, order_by: {created_at: desc}) {
      id
      name
      type
      durationType
      state
      start
      end
      data
      created_at
      updated_at
      deleted_at
    }
    campaignAggregate(where: {deleted_at: {_is_null: true}}) {
      aggregate {
        count
      }
    }
  }
`;

export default (props) => {
  const {
    editingData,
  } = props;

  const isCreating = !editingData;

  const classes = useStyles();
  const [refreshCount, setRefreshCount] = useState(0);

  const [campaigns, setCampaigns, campaignsError, setCampaignsError] = useStateWithError(isCreating ? [] : editingData.campaigns);
  const [name, setName, nameError, setNameError] = useStateWithError(isCreating ? '' : editingData.name);
  const [price, setPrice, priceError, setPriceError] = useStateWithError(isCreating ? 0 : editingData.price);
  const [materials, setMaterials, materialsError, setMaterialsError] = useStateWithError(isCreating ? '' : editingData.materials);
  const [description, setDescription, descriptionError, setDescriptionError] = useStateWithError(isCreating ? '' : editingData.description);
  const [weight, setWeight, weightError, setWeightError] = useStateWithError(isCreating ? '' : editingData.weight);

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
      setNameError('請輸入商品群組名稱');
      errorOccurred = true;
    }

    if (!price || !isInteger(price)) {
      setPriceError('錯誤的價格');
      errorOccurred = true;
    }

    if (!weight || !isNumber(weight)) {
      setWeight('錯誤的重量');
      errorOccurred = true;
    }

    if (!productGroupTypeNameMap[selectedType.id]) {
      setSelectedTypeError('請選擇商品群組類型');
      errorOccurred = true;
    }
    if (!productGroupStateNameMap[selectedState.id]) {
      setSelectedStateError('請選擇商品群組類型');
      errorOccurred = true;
    }
    if (errorOccurred) {
      return;
    }
    const data = {
      name,
      price,
      materials,
      campaigns,
      description,
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

  const { loading, error, data } = useQuery(CAMPAIGN_LIST_QUERY, {
    variables: {
      name: refreshCount.toString(),
    },
    fetchPolicy: 'network-only',
  });

  // if (loading || !data) return <pre>Loading</pre>;
  if (error) {
    return (
      <pre>
        Error in CAMPAIGN_LIST_QUERY
        {JSON.stringify(error, null, 2)}
      </pre>
    );
  }

  return (
    <React.Fragment>
      <DialogTitle id="alert-dialog-title">
        {isCreating ? '新增' : '編輯'}
        商品群組
      </DialogTitle>
      <DialogContent>
        <div className={classes.flexContainer}>
          <div className={classes.flex1}>
            {(!loading && data && data.campaigns) && (
              <FormAutocomplete
                label="關聯活動"
                size="small"
                variant="outlined"
                placeholder="新增關聯活動"
                margin="dense"
                fullWidth
                options={data.campaigns}
                value={campaigns}
                onChange={(event, newValue) => {
                  setCampaigns(newValue);
                }}
                renderOption={option => (
                  <React.Fragment>
                    {option.name}
                  </React.Fragment>
                )}
                getOptionLabel={option => option.name}
                renderTags={(value, getTagProps) => value.map((option, index) => (
                  <Chip size="small" variant="outlined" label={option.name} {...getTagProps({ index })} />
                ))}
              />
            )}
            <FormSpace variant="content1" />
            <FormTextField
              label="群組名稱"
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
              label="價格(新台幣)"
              currency
              error={!!priceError}
              helperText={priceError}
              // label={label}
              // onKeyPress={handleEnterForTextField}
              value={price}
              onChange={e => setPrice(e.target.value)}
              margin="dense"
              fullWidth
            />
            <FormSpace variant="content1" />
            <FormTextField
              label="商品材質"
              error={!!materialsError}
              helperText={materialsError}
              // label={label}
              // onKeyPress={handleEnterForTextField}
              value={materials}
              onChange={e => setMaterials(e.target.value)}
              margin="dense"
              fullWidth
              multiline
              rows={5}
              rowsMax={20}
            />
            <FormSpace variant="content1" />
            <FormTextField
              label="商品描述"
              error={!!descriptionError}
              helperText={descriptionError}
              // label={label}
              // onKeyPress={handleEnterForTextField}
              value={description}
              onChange={e => setDescription(e.target.value)}
              margin="dense"
              fullWidth
              multiline
              rows={5}
              rowsMax={20}
            />
            <FormSpace variant="content1" />
            <FormNumberInput
              label="商品重量(公克)"
              error={!!weightError}
              helperText={weightError}
              // label={label}
              // onKeyPress={handleEnterForTextField}
              value={weight}
              onChange={e => setWeight(e.target.value)}
              margin="dense"
              fullWidth
              InputProps={{
                inputProps: {
                  decimalScale: 3,
                  thousandSeparator: true,
                  suffix: ' (g)',
                },
              }}
            />
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
      <LoadingMask loading={loading} />
    </React.Fragment>
  );
};
