import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import createCommonStyles from '~/styles/common';

const styles = theme => ({
  appBar: {
    position: 'relative',
  },
  ...createCommonStyles(theme, ['flex', 'appBar']),
});

class SimpleFullScreenDialog extends React.Component {
  render() {
    const {
      classes,
      title,
      headerContent,
      children,
      open,
      onClose,
      className,
      appBarProps,
      toolBarProps,
      ...rest
    } = this.props;

    return (
      <Dialog
        fullScreen
        open={open}
        onClose={onClose}
        className={className}
        {...rest}
      >
        <AppBar className={classes.appBar} {...appBarProps}>
          <Toolbar {...toolBarProps}>
            <IconButton color="inherit" className={classes.menuButton} onClick={onClose} aria-label="Close">
              <CloseIcon />
            </IconButton>
            <Typography variant="title" color="inherit" className={classes.flex1}>
              {title}
            </Typography>
            {headerContent}
            {/* <Button color="inherit" onClick={onClose}>
              save
            </Button> */}
          </Toolbar>
        </AppBar>
        {children}
      </Dialog>
    );
  }
}

export default withStyles(styles)(SimpleFullScreenDialog);
