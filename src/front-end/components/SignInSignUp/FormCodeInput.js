import React from 'react';
import { compose } from 'recompose';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

import FormTextInput from './FormTextInput';

let styles = theme => ({
});

const FormCodeInput = (props) => {
  const {
    id,
    type = 'text',
    onShowPassswordClick,
    ...rest,
  } = props;
  let startAdornment = (
    <InputAdornment position="start">
      VXL-
    </InputAdornment>
  );
  return (
    <FormTextInput
      id={id}
      type={type}
      startAdornment={startAdornment}
      {...rest}
    />
  );
}

FormCodeInput.propTypes = {
  id: PropTypes.string.isRequired,
};

export default compose(
  withStyles(styles),
)(FormCodeInput);
