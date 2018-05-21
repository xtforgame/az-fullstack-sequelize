import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default class ConfirmDialog extends React.Component {
  handleClose = (result) => () => {
    this.props.onClose(result);
  };

  render() {
    const {
      title,
      contents,
      contentText,
      buttonComponents = {},
      buttonTexts = {},
      dialogProps,
      children,
    } = this.props;

    const YesButton = buttonComponents.yes || Button;
    const NoButton = buttonComponents.no || Button;

    const YesButtonText = buttonTexts.yes || 'Confirm';
    const NoButtonText = buttonTexts.no || 'Cancel';

    return (
      <Dialog
        fullWidth
        open={this.props.open}
        onClose={this.handleClose()}
        aria-labelledby="form-dialog-title"
        {...dialogProps}
      >
        <DialogTitle id="form-dialog-title">{title}</DialogTitle>
        <DialogContent>
          {contents}
          {!contents &&
            <DialogContentText>
              {contentText}
            </DialogContentText>
          }
          {children}
        </DialogContent>
        <DialogActions>
          <NoButton onClick={this.handleClose(false)} color="primary">
            {NoButtonText}
          </NoButton>
          <YesButton onClick={this.handleClose(true)} color="primary">
            {YesButtonText}
          </YesButton>
        </DialogActions>
      </Dialog>
    );
  }
}

ConfirmDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
