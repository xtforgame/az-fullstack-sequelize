import React from 'react';
import { createStructuredSelector } from 'reselect';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Switch from '@material-ui/core/Switch';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { injectIntl, FormattedMessage } from 'react-intl';
import { messages } from '~/containers/App/translation';
import {
  changeTheme,
} from '~/containers/App/actions';
import {
  makeUiThemeSelector,
} from '~/containers/App/selectors';
import createCommonStyles from '~/styles/common';

const styles = theme => ({
  appBar: {
    position: 'relative',
  },
  ...createCommonStyles(theme, ['flex', 'appBar']),
});

class UserSettingsDialog extends React.Component {
  handleToggle = () => {
    const {
      uiTheme,
      changeTheme,
    } = this.props;
    changeTheme({
      ...uiTheme,
      paletteType: uiTheme.paletteType === 'dark' ? 'light' : 'dark',
    });
  };

  render() {
    const {
      classes,
      open,
      onClose,
      uiTheme,
    } = this.props;
    return (
      <Dialog
        fullScreen
        open={open}
        onClose={onClose}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton color="inherit" className={classes.menuButton} onClick={onClose} aria-label="Close">
              <CloseIcon />
            </IconButton>
            <Typography variant="title" color="inherit" className={classes.flex1}>
              <FormattedMessage {...messages.settings} />
            </Typography>
            {/* <Button color="inherit" onClick={onClose}>
              save
            </Button> */}
          </Toolbar>
        </AppBar>
        <List>
          <ListItem
            button
            onClick={this.handleToggle}
          >
            {/* <ListItemIcon>
              <CloseIcon />
            </ListItemIcon> */}
            <ListItemText primary="Dark mode" secondary={uiTheme.paletteType === 'dark' ? 'on' : 'off'} />
            <ListItemSecondaryAction>
              <Switch
                onChange={this.handleToggle}
                checked={uiTheme.paletteType === 'dark'}
              />
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </Dialog>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  uiTheme: makeUiThemeSelector(),
});

export default compose(
  connect(
    mapStateToProps,
    {
      changeTheme,
    },
  ),
  injectIntl,
  withStyles(styles),
)(UserSettingsDialog);
