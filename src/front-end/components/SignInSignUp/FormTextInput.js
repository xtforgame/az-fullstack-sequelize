import React from 'react';
import { compose } from 'recompose';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Input, { InputLabel } from 'material-ui/Input';

let styles = theme => ({
});

const FormTextInput = (props) => {
  const {
    id,
    label,
    helperText,
    classes,
    ...rest,
  } = props;
  return (
    <FormControl>
      {!!label && <InputLabel htmlFor={id}>{label}</InputLabel>}
      <Input
        id={id}
        label={label}
        {...rest}
      />
      {!!helperText && <FormHelperText id={`${id}-helper-text`}>{helperText}</FormHelperText>}
    </FormControl>
  );
}

FormTextInput.propTypes = {
  id: PropTypes.string.isRequired,
};

export default compose(
  withStyles(styles),
)(FormTextInput);
