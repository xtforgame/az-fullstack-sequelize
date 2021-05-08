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
import { isFunctionV2 } from 'common/utils';

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
  ] = useNumberInput(value.totalPrice || 1, '', {
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
      canCombine,
    });
  }, [
    totalPrice,
    totalAmount,
    dicountMethod,
    disconutPrice,
    disconutPercentage,
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
      if (errorOccurred) {
        return;
      }
      return {
        totalPrice: parseInt(totalPrice),
        totalAmount: parseInt(totalAmount),
        dicountMethod: dicountMethod,
        disconutPrice: parseInt(disconutPrice),
        disconutPercentage: parseFloat(disconutPercentage),
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
