import React from 'react';
import { compose } from 'recompose';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { InputAdornment } from 'material-ui/Input';
import IconButton from 'material-ui/IconButton';
import Visibility from 'material-ui-icons/Visibility';
import VisibilityOff from 'material-ui-icons/VisibilityOff';

import FormTextInput from './FormTextInput';

let styles = theme => ({
});

const FormPasswordInput = (props) => {
  const {
    id,
    type = 'password',
    onShowPassswordClick,
    ...rest,
  } = props;
  let endAdornment = (
    <InputAdornment position="end">
      <IconButton
        onClick={onShowPassswordClick}
        onMouseDown={event => {
          event.preventDefault();
        }}
      >
        {type !== 'password' ? <VisibilityOff /> : <Visibility />}
      </IconButton>
    </InputAdornment>
  );
  return (
    <FormTextInput
      id={id}
      type={type}
      endAdornment={endAdornment}
      {...rest}
    />
  );
}

FormPasswordInput.propTypes = {
  id: PropTypes.string.isRequired,
};

export default compose(
  withStyles(styles),
)(FormPasswordInput);
