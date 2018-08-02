/* eslint-disable react/prop-types, react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import DialogContent from '@material-ui/core/DialogContent';
import { FormTextInput, FormSpace } from '../SignInSignUp';
import ConfirmDialog from './ConfirmDialog';

export default class InputDialog extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {
      editingText: this.props.value || '',
    };
  }

  handleEnterForTextField = (event) => {
    if (event.key === 'Enter') {
      this.handleClose(true);
      event.preventDefault();
    }
  };

  handleClose = (_result) => {
    let result = _result;
    if (result === true) {
      result = this.state.editingText;
    }
    if (this.props.onClose) {
      this.props.onClose(result);
    }
  }

  render() {
    const {
      id,
      label,
      onClose,
      ...rest
    } = this.props;
    return (
      <ConfirmDialog
        {...rest}
        onClose={this.handleClose}
      >
        <DialogContent>
          <FormSpace variant="content2" />
          <FormTextInput
            id={id}
            label={label}
            onKeyPress={this.handleEnterForTextField}
            value={this.state.editingText}
            onChange={e => this.setState({ editingText: e.target.value })}
            formProps={{
              style: {
                width: '100%',
              },
            }}
            autoFocus
            margin="dense"
            fullWidth
          />
        </DialogContent>
      </ConfirmDialog>
    );
  }
}

InputDialog.propTypes = {
  id: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
