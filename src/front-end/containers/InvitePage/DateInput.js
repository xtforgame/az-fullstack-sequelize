/* eslint-disable react/prop-types, react/forbid-prop-types */
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FormDatePicker, FormSpace } from 'azrmui/core/FormInputs';

export default (props) => {
  const {
    value,
    onChange,
  } = props;

  const { t } = useTranslation(['builtin-components']);

  return (
    <FormDatePicker
      label={t('dateStart')}
      value={value}
      onChange={onChange}
    />
  );
};
