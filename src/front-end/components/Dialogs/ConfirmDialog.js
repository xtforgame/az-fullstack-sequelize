/* eslint-disable react/prop-types, react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { compose } from 'recompose';
import createCommonStyles from '~/styles/common';

const styles = theme => ({
  appBar: {
    position: 'relative',
  },
  ...createCommonStyles(theme, ['flex', 'appBar']),
});

class ConfirmDialog extends React.Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
  };

  handleClose = result => () => {
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
      classes,
      fullScreen,
    } = this.props;

    const YesButton = buttonComponents.yes || Button;
    const NoButton = buttonComponents.no || Button;

    const YesButtonText = buttonTexts.yes || 'Confirm';
    const NoButtonText = buttonTexts.no || 'Cancel';

    return (
      <Dialog
        fullScreen={fullScreen}
        open={this.props.open}
        onClose={this.handleClose()}
        aria-labelledby="form-dialog-title"
        {...dialogProps}
      >
        {fullScreen && (
          <AppBar className={classes.appBar}>
            <Toolbar>
              <IconButton color="inherit" className={classes.menuButton} onClick={this.handleClose(false)} aria-label="Close">
                <CloseIcon />
              </IconButton>
              <Typography variant="title" color="inherit" className={classes.flex1}>
                {title}
              </Typography>
              {/* <Button color="inherit" onClick={onClose}>
              save
            </Button> */}
            </Toolbar>
          </AppBar>
        )
        }
        {!fullScreen && (
          <DialogTitle id="form-dialog-title">
            {title}
          </DialogTitle>
        )}
        {!!(contents || contentText) && (
          <DialogContent>
            {contents}
            {!contents
            && (
              <DialogContentText>
                {contentText}
              </DialogContentText>
            )
            }
          </DialogContent>
        )}
        {children}
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

export default compose(
  withStyles(styles),
)(ConfirmDialog);
