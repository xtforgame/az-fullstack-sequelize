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
import Paper from '@material-ui/core/Paper';
// import { getDefaultBeforeDaysConfig, makeDaysFilter } from '~/utils/beforeDaysHelper';
// import { compareString, formatTime } from '~/utils/tableUtils';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import Chip from '@material-ui/core/Chip';
import {
  FormNumberInput, FormOutlinedSelect, FormFieldButtonSelect, FormTextField, FormSpace,
} from 'azrmui/core/FormInputs';
import DateRangeInput from '~/components/DateRangeInput';
import useRouterPush from '~/hooks/useRouterPush';
import TagsAutocomplete from '~/components/TagsAutocomplete';
import useTextField from '~/components/hooks/inputs/useTextField';
import useFormSelect from '~/components/hooks/inputs/useFormSelect';
import useNumberInput from '~/components/hooks/inputs/useNumberInput';
import useSwitch from '~/components/hooks/inputs/useSwitch';
import FormAutocomplete from '~/components/FormAutocomplete';
import { isFunctionV2, toMap } from 'common/utils';

export const dicountMethods = [
  { id: 'fixed-number', name: '固定折扣' },
  { id: 'percentage', name: '比例折扣' },
  { id: 'free-shipping', name: '免運' },
];

const useStyles = makeStyles(theme => ({
  paper: {
    width: '100%',
    // border: `solid 1px ${theme.palette.grey[300]}`,
    border: `solid 1px black`,
    marginBottom: 24,
    padding: 8,
  },
}));

const freeShippingAreaOptions = [
  { id: 'ship', name: '台灣本島' },
  { id: 'outlying', name: '台灣離島' },
  { id: 'oversea', name: '海外寄送' },
];

const freeShippingAreaOptionMap = toMap(freeShippingAreaOptions, o => o.id);

export default (props) => {
  const {
    value: v,
    onChange = () => {},
    selectedType,
    formApiRef,
  } = props;

  const classes = useStyles();

  const value = v || {};

  const [
    [totalPrice, setTotalPrice, totalPriceError, setTotalPriceError],
    totalPriceInput,
  ] = useNumberInput(value.totalPrice || 0, '', {
    label: '滿額價格(新台幣)',
    required: true,
    currency: true,
  });

  const [
    [totalAmount, setTotalAmount, totalAmountError, setTotalAmountError],
    totalAmountInput,
  ] = useNumberInput(value.totalAmount || 1, '', {
    label: '滿量數量(件)',
    required: true,
    InputProps: {
      inputProps: {
        thousandSeparator: true,
        suffix: '(件)',
      },
    },
  });

  const [
    [dicountMethod, setDicountMethod, dicountMethodError, setDicountMethodError],
    dicountMethodInput,
  ] = useFormSelect(value.dicountMethod || dicountMethods[0].id, '', {
    label: '折扣方式',
    valueKey: 'id',
    labelKey: 'name',
    items: dicountMethods,
  });

  const [
    [disconutPrice, setDisconutPrice, disconutPriceError, setDisconutPriceError],
    disconutPriceInput,
  ] = useNumberInput(value.disconutPrice || 0, '', {
    label: '折扣價格(新台幣)',
    required: true,
    currency: true,
  });

  const [
    [disconutPercentage, setDisconutPercentage, disconutPercentageError, setDisconutPercentageError],
    disconutPercentageInput,
  ] = useNumberInput(value.disconutPercentage || 0, '', {
    label: '折扣比例(%)',
    required: true,
    InputProps: {
      inputProps: {
        decimalScale: 3,
        thousandSeparator: true,
        suffix: '%',
      },
    },
  });

  const [freeShippingAreaList, setFreeShippingAreaList, freeShippingAreaListError, setFreeShippingAreaListError] = useStateWithError(
    (value.freeShippingAreaList || ['ship']).map(c => freeShippingAreaOptionMap[c]).filter(c => c),
  );

  const [
    [canCombine, setCanCombine, canCombineError, setCanCombineError],
    canCombineInput,
  ] = useSwitch(value.canCombine || false, '', {
    labelProps: {
      labelPlacement: 'end',
    },
  });

  useEffect(() => {
    onChange({
      totalPrice,
      totalAmount,
      dicountMethod,
      disconutPrice,
      disconutPercentage,
      freeShippingAreaList,
      canCombine,
    });
  }, [
    totalPrice,
    totalAmount,
    dicountMethod,
    disconutPrice,
    disconutPercentage,
    freeShippingAreaList,
    canCombine,
  ]);

  const getDataToSubmit = () => {
    console.log('selectedType :', selectedType);
    if (
      (selectedType === 'discount-basic')
      || (selectedType === 'discount-total-price')
      || (selectedType === 'discount-total-amount')
    ) {
      let errorOccurred = false;
      if (dicountMethod === 'free-shipping' && !freeShippingAreaList.length) {
        setFreeShippingAreaListError('請至少指定一個免運區域');
        errorOccurred = true;
      }
      if (errorOccurred) {
        return;
      }
      return {
        totalPrice: parseInt(totalPrice),
        totalAmount: parseInt(totalAmount),
        dicountMethod: dicountMethod,
        disconutPrice: parseInt(disconutPrice),
        disconutPercentage: parseFloat(disconutPercentage),
        freeShippingAreaList: freeShippingAreaList.map(o => o.id),
        canCombine,
      };
    }
    return {};
  };

  if (formApiRef) {
    if (isFunctionV2(formApiRef)) {
      formApiRef({ getDataToSubmit });
    } else {
      formApiRef.current = { getDataToSubmit };
    }
  }

  return (
    <React.Fragment>
      {(
        (selectedType === 'discount-basic')
        || (selectedType === 'discount-total-price')
        || (selectedType === 'discount-total-amount')
      )
        && (
          <Paper className={classes.paper} elevation={0}>
            {dicountMethodInput.render()}
            {(selectedType === 'discount-total-price')
              && (
                <React.Fragment>
                  <FormSpace variant="content2" />
                  {totalPriceInput.render()}
                </React.Fragment>
              )
            }
            {(selectedType === 'discount-total-amount')
              && (
                <React.Fragment>
                  <FormSpace variant="content2" />
                  {totalAmountInput.render()}
                </React.Fragment>
              )
            }
            {(dicountMethod === 'fixed-number')
              && (
                <React.Fragment>
                  <FormSpace variant="content2" />
                  {disconutPriceInput.render()}
                </React.Fragment>
              )
            }
            {(dicountMethod === 'percentage')
              && (
                <React.Fragment>
                  <FormSpace variant="content2" />
                  {disconutPercentageInput.render()}
                </React.Fragment>
              )
            }
            {(dicountMethod === 'free-shipping')
              && (
                <React.Fragment>
                  <FormSpace variant="content2" />
                  {disconutPriceInput.render()}
                  <FormSpace variant="content2" />
                  <FormAutocomplete
                    inputProps={{
                      error: !!freeShippingAreaListError,
                      helperText: freeShippingAreaListError,
                      variant: 'outlined',
                      placeholder: '新增免運區域',
                      margin: 'dense',
                      fullWidth: true,
                      label: '免運區域',
                    }}
                    noOptionsText="查無資料"
                    size="small"
                    multiple
                    options={freeShippingAreaOptions}
                    value={freeShippingAreaList}
                    onChange={(event, newValue) => {
                      setFreeShippingAreaList(newValue);
                    }}
                    renderOption={option => (
                      <React.Fragment>
                        {option.name}
                      </React.Fragment>
                    )}
                    filterOptions={(options, state) => options.filter(o => !freeShippingAreaList.find(c => c.id === o.id))}
                    getOptionLabel={option => option.name}
                    renderTags={(value, getTagProps) => value.map((option, index) => (
                      <Chip size="small" variant="outlined" label={option.name} {...getTagProps({ index })} />
                    ))}
                  />
                </React.Fragment>
              )
            }


            <FormSpace variant="content2" />
            {canCombineInput.render({
              label: canCombine ? '可合併其他折扣' : '不可合併其他折扣(擇優計算)',
            })}
          </Paper>
        )
      }
    </React.Fragment>
  );
};
