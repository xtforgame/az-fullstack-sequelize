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

const handleUpload = createHandleUploadFunction('/api/files');

function isInteger(str) {
  return !Number.isNaN(str) && !Number.isNaN(parseInt(str));
}

function isNumber(str) {
  return !Number.isNaN(str) && !Number.isNaN(parseFloat(str));
}


const PRODUCT_GROUP_LIST_QUERY = gql`
query ProductGroupList {
  productGroups(where: {deleted_at: {_is_null: true}}, order_by: {created_at: desc}) {
    id
    customId
    products_aggregate(where: {deleted_at: {_is_null: true}}) {
      aggregate{ count }
    }
    products(where: {deleted_at: {_is_null: true}}) { id, name }
    category { id, name }
    campaigns(where: {deleted_at: {_is_null: true}}) { campaign {
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
    } }
    thumbnail
    pictures
    name
    price
    weight
    description
    materials
    data
  }
  productGroupAggregate(where: {deleted_at: {_is_null: true}}) {
    aggregate {
      count
    }
  }
}
`;

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
  const [name, setName, nameError, setNameError] = useStateWithError(isCreating ? '' : editingData.name);
  const [colorInfo, setColorInfo] = useStateWithError(getDefaultColor(editingData));
  const [price, setPrice, priceError, setPriceError] = useStateWithError(isCreating ? 0 : editingData.price);
  const [materials, setMaterials, materialsError, setMaterialsError] = useStateWithError(isCreating ? '' : editingData.materials);
  const [description, setDescription, descriptionError, setDescriptionError] = useStateWithError(isCreating ? '' : editingData.description);
  const [weight, setWeight, weightError, setWeightError] = useStateWithError(isCreating ? '' : editingData.weight);

  console.log('group :', group);
  const [imageInfos, setImageInfos] = useState(isCreating ? [] : editingData.pictures);

  const push = useRouterPush();
  const submit = async () => {
    let errorOccurred = false;
    if (!name) {
      setNameError('請輸入商品名稱');
      errorOccurred = true;
    }

    console.log('imageInfos :', imageInfos);

    if (!price || !isInteger(price)) {
      setPriceError('錯誤的價格');
      errorOccurred = true;
    }

    if (!weight || !isNumber(weight)) {
      setWeightError('錯誤的重量');
      errorOccurred = true;
    }

    if (errorOccurred) {
      return;
    }
    const ii = imageInfos.map(({ imageUploadInfo, image, ...rest }) => ({ image: { ...image, imgUrl: path.join('/api/files', image.hash) }, ...rest }));
    const data = {
      name,
      price,
      materials,
      weight,
      group: group && group.id,
      colorName: colorInfo[0],
      color: JSON.stringify(colorInfo[1]),
      size: 'F',
      description,
      pictures: ii,
    };
    if (ii[0]) {
      [data.thumbnail] = ii;
    }
    try {
      if (isCreating) {
        await axios({
          method: 'post',
          url: 'api/products',
          data,
        });
      } else {
        await axios({
          method: 'patch',
          url: `api/products/${editingData.id}`,
          data,
        });
      }
      push('/product');
    } catch (error) {
      alert(`更新失敗：${error.message}`);
    }
  };

  const { loading, error, data } = useQuery(PRODUCT_GROUP_LIST_QUERY, {
    variables: {
      name: refreshCount.toString(),
    },
    fetchPolicy: 'network-only',
  });

  // if (loading || !data) return <pre>Loading</pre>;
  if (error) {
    return (
      <pre>
        Error in PRODUCT_GROUP_LIST_QUERY
        {JSON.stringify(error, null, 2)}
      </pre>
    );
  }

  return (
    <React.Fragment>
      <DialogTitle id="alert-dialog-title">
        {isCreating ? '新增' : '編輯'}
        商品
      </DialogTitle>
      <DialogContent>
        <div className={classes.flexContainer}>
          <div className={classes.flex1}>
            {(!loading && data && data.productGroups) && (
              <FormAutocomplete
                label="商品群組"
                size="small"
                variant="outlined"
                placeholder="新增商品群組"
                margin="dense"
                fullWidth
                options={data.productGroups}
                value={group}
                onChange={(event, newValue) => {
                  setGroup(newValue);
                }}
                renderOption={option => (
                  <React.Fragment>
                    {(option && option.name) || ''}
                  </React.Fragment>
                )}
                filterOptions={(options, { inputValue }) => options.filter(o => o.name.indexOf(inputValue) !== -1)}
                getOptionLabel={option => (option && option.name) || ''}
                renderTags={(value, getTagProps) => value.map((option, index) => (
                  <Chip size="small" variant="outlined" label={option.name} {...getTagProps({ index })} />
                ))}
              />
            )}
            <FormSpace variant="content1" />
            <FormTextField
              label="商品名稱"
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
            <ColorInput
              title="選取色彩"
              value={colorInfo}
              onChange={setColorInfo}
              buttonProps={{
                margin: 'dense',
              }}
            />
            <FormSpace variant="content1" />
            <FormImagesInput
              label="Images"
              value={imageInfos}
              onChange={setImageInfos}
              onAdd={(imageInfo, { context }) => {
                context.uploadImage(imageInfo);
                setImageInfos(imageInfos => imageInfos.concat([imageInfo]));
              }}
              fullWidth
              handleUpload={handleUpload}
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
        <Button onClick={() => { push('/product'); }} color="primary">
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