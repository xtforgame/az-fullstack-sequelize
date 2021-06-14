// *https://www.registers.service.gov.uk/registers/country/use-the-api*
import fetch from 'cross-fetch';
import React, { useState, useCallback, useRef } from 'react';
import { debounce } from 'lodash';
import { useQuery, gql } from '@apollo/client';
import Chip from '@material-ui/core/Chip';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import ListboxComponent from '~/components/ListboxComponent';
import FormAutocomplete, { FormAutocompleteProps } from '~/components/FormAutocomplete';

const USER_LIST_QUERY = gql`
  query UserList($searchText: String!) {
    users(where: {_or: [{name: {_ilike: $searchText}}, {email: {_ilike: $searchText}}]}) {
      id
      name
      email
    }
  }
`;

export default () => {
  const [inputValue, setInputValue] = useState('');
  const [searchText, setSearchText] = useState(inputValue);
  const [loading0, setLoading0] = useState(false);
  const [refreshCount, setRefreshCount] = useState(0);

  const { loading, error, data } = useQuery(USER_LIST_QUERY, {
    variables: {
      name: refreshCount.toString(),
      searchText: `%${searchText || 'rbtrbtekvlemvlenbvjkt'}%`,
    },
    fetchPolicy: 'network-only',
  });

  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);

  const debounceLoadData = useCallback(debounce((v) => {
    setLoading0(false);
    setSearchText(v);
  }, 1000), []);


  React.useEffect(() => {
    setLoading0(true);
    setOptions([]);
    debounceLoadData(inputValue);
  }, [inputValue]);

  React.useEffect(() => {
    if (!open) {
      setOptions([]);
    } else {
      setOptions(data?.users || []);
    }
  }, [open, data]);

  return (
    <FormAutocomplete
      size="small"
      style={{ width: '100%' }}
      // multiple
      inputValue={inputValue}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      renderTags={(value, getTagProps) => value.map((option, index) => (
        <Chip size="small" variant="outlined" label={(`${option.name} / ${option.email}` as any)} {...getTagProps({ index })} />
      ))}
      ListboxComponent={ListboxComponent}
      renderOption={option => (
        <React.Fragment>
          {(`${option.name} / ${option.email}` as any)}
        </React.Fragment>
      )}
      getOptionSelected={(option, value) => option.id === value.id}
      getOptionLabel={(option) => `${option.name} (ID:${option.id})`}
      options={options}
      loading={loading0 || loading}
      renderInput={(params) => (
        <TextField
          {...params}
          label="選擇會員"
          variant="outlined"
          fullWidth
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading0 || loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
    />
  );
};
