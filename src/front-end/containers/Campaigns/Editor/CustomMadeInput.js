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
    [suffix, setSuffix, suffixError, setSuffixError],
    suffixInput,
  ] = useTextField(value.suffix || '', '', {
    label: '轉為預購的商品後綴字，不用加括號',
    required: true,
    placeholder: 'ex. 商品將於五月底陸續出貨',
  });

  useEffect(() => {
    onChange({
      suffix,
    });
  }, [
    suffix,
  ]);

  const getDataToSubmit = () => {
    if (
      (selectedType === 'custom-made-classic')
      || (selectedType === 'custom-made-limited')
    ) {
      let errorOccurred = false;
      if (errorOccurred) {
        return;
      }
      return {
        suffix: suffix || '',
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
        (selectedType === 'custom-made-classic')
        || (selectedType === 'custom-made-limited')
      )
        && (
          <Paper className={classes.paper} elevation={0}>
            {suffixInput.render()}
          </Paper>
        )
      }
    </React.Fragment>
  );
};
