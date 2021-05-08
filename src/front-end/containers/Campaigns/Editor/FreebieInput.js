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
import { useQuery, gql } from '@apollo/client';
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
import FormAutocomplete from '~/components/FormAutocomplete';
import useNumberInput from '~/components/hooks/inputs/useNumberInput';
import useSwitch from '~/components/hooks/inputs/useSwitch';
import { isFunctionV2 } from 'common/utils';

const useStyles = makeStyles(theme => ({
  paper: {
    width: '100%',
    // border: `solid 1px ${theme.palette.grey[300]}`,
    border: `solid 1px black`,
    marginBottom: 24,
    padding: 8,
  },
}));

const PRODUCT_GROUP_LIST_QUERY = gql`
query ProductGroupList {
  productGroups(where: {deleted_at: {_is_null: true}}, order_by: {created_at: desc}) {
    id
    uid
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

function isInteger(str) {
  return !Number.isNaN(str) && !Number.isNaN(parseInt(str));
}

export default (props) => {
  const {
    value: v,
    onChange = () => {},
    selectedType,
    formApiRef,
  } = props;

  const classes = useStyles();

  const value = v || {};

  const [refreshCount, setRefreshCount] = useState(0);
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

  const [group, setGroup, groupError, setGroupError] = useStateWithError(value.group);

  const [
    [freebieAmount, setFreebieAmount, freebieAmountError, setFreebieAmountError],
    freebieAmountInput,
  ] = useNumberInput(value.freebieAmount || 1, '', {
    label: '贈品數量',
    required: true,
  });

  const [
    [freebieMaxAmount, setFreebieMaxAmount, freebieMaxAmountError, setFreebieMaxAmountError],
    freebieMaxAmountInput,
  ] = useNumberInput(value.freebieMaxAmount || 1, '', {
    label: '贈品數量上限',
    required: true,
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
      group,
      freebieAmount,
      freebieMaxAmount,
      canCombine,
    });
  }, [
    totalPrice,
    totalAmount,
    group,
    freebieAmount,
    freebieMaxAmount,
    canCombine,
  ]);

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

  const getDataToSubmit = () => {
    if (
      (selectedType === 'freebie-total-price')
    ) {
      let errorOccurred = false;
      if (!group) {
        setGroupError('請選擇商品群組');
        errorOccurred = true;
      }
      if (!totalPrice || !isInteger(totalPrice) || !parseInt(totalPrice)) {
        setTotalPriceError('錯誤的總價');
        errorOccurred = true;
      }
      if (!freebieAmount || !isInteger(freebieAmount) || !parseInt(freebieAmount)) {
        setFreebieAmountError('錯誤的贈品數量');
        errorOccurred = true;
      }
      if (!freebieMaxAmount || !isInteger(freebieMaxAmount) || !parseInt(freebieMaxAmount)) {
        setFreebieMaxAmountError('錯誤的贈品數量上限');
        errorOccurred = true;
      }
      if (errorOccurred) {
        return;
      }
      return {
        totalPrice: parseInt(totalPrice),
        totalAmount: parseInt(totalAmount),
        group,
        freebieAmount: parseInt(freebieAmount),
        freebieMaxAmount: parseInt(freebieMaxAmount),
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
        (selectedType === 'freebie-total-price')
      )
        && (
          <Paper className={classes.paper} elevation={0}>
            {(selectedType === 'freebie-total-price')
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
            {(!loading && data && data.productGroups) && (
              <FormAutocomplete
                inputProps={{
                  variant: 'outlined',
                  placeholder: '選擇商品群組',
                  margin: 'dense',
                  fullWidth: true,
                  required: true,
                  label: '商品群組',
                  error: !!groupError,
                  helperText: groupError,
                }}
                noOptionsText="查無資料"
                // error={!!groupError}
                // helperText={groupError}
                label="商品群組"
                fullWidth
                size="small"
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
            <FormSpace variant="content2" />
            {freebieAmountInput.render()}
            <FormSpace variant="content2" />
            {freebieMaxAmountInput.render()}
            <FormSpace variant="content2" />
            {canCombineInput.render({
              label: canCombine ? '可合併其他贈品' : '不可合併其他贈品(擇優計算)',
            })}
          </Paper>
        )
      }
    </React.Fragment>
  );
};
