/* eslint-disable no-use-before-define */
import React, { useState } from 'react';
import Chip from '@material-ui/core/Chip';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles(theme => ({
}));

export default (props) => {
  const {
    options,
    size = 'medium',
    value,
    onChange,
    renderOption = option => (
      <React.Fragment>
        {option}
      </React.Fragment>
    ),
    getOptionLabel = option => option.title,
    renderTags = (value, getTagProps) => value.map((option, index) => (
      <Chip size={size} variant="outlined" label={option} {...getTagProps({ index })} />
    )),
    ...rest
  } = props;
  const classes = useStyles();

  const [inputValue, setInputValue] = useState('');
  return (
    <Autocomplete
      multiple
      size={size}
      options={options}
      value={value || []}
      onChange={onChange}
      inputValue={inputValue}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      filterSelectedOptions
      getOptionLabel={getOptionLabel}
      renderOption={renderOption}
      renderTags={renderTags}
      renderInput={params => (
        <TextField
          variant="outlined"
          {...rest}
          {...params}
        />
      )}
    />
  );
};
