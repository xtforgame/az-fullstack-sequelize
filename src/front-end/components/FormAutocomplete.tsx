/* eslint-disable no-use-before-define */
import React, { useState } from 'react';
import { Overwrite } from 'common/utils';
import Chip from '@material-ui/core/Chip';
import Autocomplete, { AutocompleteProps, RenderInputParams } from '@material-ui/lab/Autocomplete';
import { UseAutocompleteProps } from '@material-ui/lab/useAutocomplete';
import FormTextField, { FormTextFieldProps } from 'azrmui/core/FormInputs/FormTextField';

export type FormAutocompleteProps<T> = Overwrite<AutocompleteProps<T> & UseAutocompleteProps<T>, {
  inputProps?: FormTextFieldProps;
  renderInput?: (params: RenderInputParams) => React.ReactNode
}>;


export default function FormAutocomplete<T>(props : FormAutocompleteProps<T>) {
  const {
    options,
    multiple,
    size = 'medium',
    value,
    onChange,
    renderOption = option => (
      <React.Fragment>
        {(option as any)}
      </React.Fragment>
    ),
    getOptionLabel = option => (option as any).title,
    renderTags = (value, getTagProps) => value.map((option, index) => (
      <Chip size={size} variant="outlined" label={(option as any)} {...getTagProps({ index })} />
    )),
    filterOptions,
    inputProps,
    renderInput,
    ...rest
  } = props;
  const [inputValue, setInputValue] = useState('');
  const renderInputFunc = renderInput || (params => (
    <FormTextField
      {...inputProps}
      {...params}
    />
  ));
  return (
    <Autocomplete<T>
      multiple={multiple as any}
      size={size as any}
      options={options as any}
      value={value as any}
      onChange={onChange as any}
      inputValue={inputValue as any}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      filterSelectedOptions
      filterOptions={filterOptions}
      getOptionLabel={getOptionLabel}
      renderOption={renderOption}
      renderTags={renderTags}
      renderInput={renderInputFunc}
      {...rest as { [s: string]: any; }}
    />
  );
}
