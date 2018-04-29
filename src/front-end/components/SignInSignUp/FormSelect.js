import React from 'react';
import { compose } from 'recompose';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Input, { InputLabel } from 'material-ui/Input';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Select from 'material-ui/Select';

const styles = theme => ({
});

const FormSelect = (props) => {
  const {
    id,
    name,
    label,
    helperText,
    formProps,
    inputProps,
    classes,
    children,
    ...rest,
  } = props;
  return (
    <FormControl {...formProps}>
      {!!label && <InputLabel htmlFor={id}>{label}</InputLabel>}
      <Select
        id={id}
        input={<Input {...inputProps} name={name} id={id} />}
        {...rest}
      >
        {children}
      </Select>
      {!!helperText && <FormHelperText id={`${id}-helper-text`}>{helperText}</FormHelperText>}
    </FormControl>
  );
}

FormSelect.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

export default compose(
  withStyles(styles),
)(FormSelect);
