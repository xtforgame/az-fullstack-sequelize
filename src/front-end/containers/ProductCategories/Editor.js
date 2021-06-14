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
import path from 'path';
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
import { createHandleUploadFunction } from 'azrmui/core/FormInputs/FormImagesInput';
import {
  FormNumberInput, FormImagesInput, FormSwitch, FormTextField, FormSpace,
} from 'azrmui/core/FormInputs';
import DateRangeInput from '~/components/DateRangeInput';
import useRouterPush from '~/hooks/useRouterPush';
import FormAutocomplete from '~/components/FormAutocomplete';
import LoadingMask from '~/components/TableShared/LoadingMask';
import useTextField from '~/components/hooks/inputs/useTextField';

const handleUpload = createHandleUploadFunction('/api/files');

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
  const [
    [nameEn, setNameEn, nameEnError, setNameEnError],
    nameEnInput,
  ] = useTextField(isCreating ? '' : (editingData.nameEn || ''), '', {
    label: '英文名稱',
    required: true,
  });
  const [priority, setPriority, priorityError, setPriorityError] = useStateWithError(isCreating ? 0 : editingData.priority);
  const [active, setActive, activeError, setActiveError] = useStateWithError(isCreating ? false : editingData.active);
  const [imageInfos, setImageInfos, imageInfosError, setImageInfosError] = useStateWithError(isCreating ? [] : (editingData.specPic ? [editingData.specPic] : []));

  const [
    [specsDesc, setSpecsDesc, specsDescError, setSpecsDescError],
    specsDescInput,
  ] = useTextField(isCreating ? '' : editingData.specsDesc, '', {
    label: '尺寸表',
    placeholder: `格式:\n尺寸名1:數值1\n尺寸名2:數值2`,
    required: true,
    margin: 'dense',
    fullWidth: true,
    multiline: true,
    rows: 5,
    rowsMax: 20,
  });

  const [
    [modelsReference1, setModelsReference1, modelsReference1Error, setModelsReference1Error],
    modelsReference1Input,
  ] = useTextField(isCreating ? '' : editingData.modelsReference1, '', {
    label: '小編試穿',
    placeholder: `格式:\n尺寸名1:數值1\n尺寸名2:數值2`,
    required: true,
    margin: 'dense',
    fullWidth: true,
    multiline: true,
    rows: 5,
    rowsMax: 20,
  });

  const [
    [modelsReference2, setModelsReference2, modelsReference2Error, setModelsReference2Error],
    modelsReference2Input,
  ] = useTextField(isCreating ? '' : editingData.modelsReference2, '', {
    label: 'model試穿',
    placeholder: `格式:\n尺寸名1:數值1\n尺寸名2:數值2`,
    required: true,
    margin: 'dense',
    fullWidth: true,
    multiline: true,
    rows: 5,
    rowsMax: 20,
  });

  // console.log('imageInfos :', imageInfos);
  // code

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

    const ii = imageInfos.map(({ imageUploadInfo, image, ...rest }) => ({ image: { ...image, imgUrl: path.join('/api/files', image.hash) }, ...rest }));
    if (!ii[0]) {
      setImageInfosError('請上傳尺寸示意圖');
      errorOccurred = true;
    }

    if (errorOccurred) {
      return;
    }

    const data = {
      name,
      nameEn,
      priority,
      active,
      specPic: ii[0],
      specsDesc,
      modelsReference1,
      modelsReference2,
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
            {nameEnInput.render()}
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
            <FormSpace variant="content1" />
            <FormImagesInput
              label="尺寸示意圖"
              value={imageInfos}
              error={!!imageInfosError}
              helperText={imageInfosError}
              onChange={setImageInfos}
              onAdd={(imageInfo, { context }) => {
                context.uploadImage(imageInfo);
                setImageInfos(imageInfos => imageInfos.concat([imageInfo]));
              }}
              fullWidth
              handleUpload={handleUpload}
            />
            <FormSpace variant="content1" />
            {specsDescInput.render()}
            <FormSpace variant="content1" />
            {modelsReference1Input.render()}
            <FormSpace variant="content1" />
            {modelsReference2Input.render()}
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
