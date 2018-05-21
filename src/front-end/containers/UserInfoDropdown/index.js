// @flow weak

import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import AccountBox from '@material-ui/icons/AccountBox';
import ExitToApp from '@material-ui/icons/ExitToApp';
import Settings from '@material-ui/icons/Settings';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { injectIntl } from 'react-intl';
import { changeLocale } from '~/containers/LanguageProvider/actions';
import { makeSelectLocale } from '~/containers/LanguageProvider/selectors';
import { appLocales, appLocaleNames, localeIndex } from '~/i18n';
import { compose } from 'recompose';
import modelMap from '~/containers/App/modelMap';
import { FormattedMessage } from 'react-intl';
import formatMessage from '~/utils/formatMessage';
import { messages } from '~/containers/App/translation';
import UserSettingsDialog from '~/containers/UserSettingsDialog';
import { push } from 'react-router-redux';

const {
  clearSessionCache,
} = modelMap.actions;

const styles = theme => ({
  menuItem: {
    // '&:focus': {
    //   backgroundColor: theme.palette.primary.main,
    //   '& $primary, & $icon': {
    //     color: theme.palette.common.white,
    //   },
    // },
  },
  primary: {},
  icon: {},
});

class UserInfoDropdown extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      anchorEl: null,
      menuOpen: false,
      settingsOpen: false,
    };
  }

  handleClick = event => {
    this.setState({
      menuOpen: true,
      anchorEl: event.currentTarget,
    });
  };

  handleRequestCloseMenu = () => {
    this.setState({ menuOpen: false });
  };

  handleRequestCloseSettings = () => {
    this.setState({ settingsOpen: false });
  };

  getMenuItmes(){
    const { classes, intl, clearSessionCache, push, ...props } = this.props;
    return (
      <React.Fragment>
        <MenuItem
          className={classes.menuItem}
          onClick={event => {
            this.setState({
              menuOpen: false,
            });
            push('/user-profile');
          }}
        >
          {/* <ListItemIcon
            className={classes.icon}
          >
            <AccountBox />
          </ListItemIcon> */}
          <ListItemText
            inset
            classes={{ primary: classes.primary }}
            primary={<FormattedMessage {...messages.profile} />}
          />
        </MenuItem>
        <MenuItem
          className={classes.menuItem}
          onClick={event => {
            this.setState({
              menuOpen: false,
            });
          }}
        >
          {/* <ListItemIcon
            className={classes.icon}
          >
            <AccountBox />
          </ListItemIcon> */}
          <ListItemText
            inset
            classes={{ primary: classes.primary }}
            primary={<FormattedMessage {...messages.myAccount} />}
          />
        </MenuItem>
        <MenuItem
          className={classes.menuItem}
          onClick={event => {
            this.setState({
              settingsOpen: true,
              menuOpen: false,
            });
          }}
        >
          <ListItemIcon
            className={classes.icon}
          >
            <Settings />
          </ListItemIcon>
          <ListItemText
            inset
            classes={{ primary: classes.primary }}
            primary={<FormattedMessage {...messages.settings} />}
          />
        </MenuItem>
        <Divider />
        <MenuItem
          className={classes.menuItem}
          onClick={event => {
            this.setState({
              menuOpen: false,
            });
            clearSessionCache('me');
          }}
        >
          <ListItemIcon
            className={classes.icon}
          >
            <ExitToApp />
          </ListItemIcon>
          <ListItemText
            inset
            classes={{ primary: classes.primary }}
            primary={<FormattedMessage {...messages.logout} />}
          />
        </MenuItem>
      </React.Fragment>
    );
  }

  render(){
    const { classes, intl, clearSessionCache, push, ...props } = this.props;
    return (
      <div>
        <IconButton
          color="inherit"
          aria-owns={this.state.open ? 'options-menu' : null}
          aria-haspopup="true"
          {...props}
          onClick={this.handleClick}
        >
          <AccountCircle />
        </IconButton>
        <Menu
          id="simple-menu"
          anchorEl={this.state.anchorEl}
          open={this.state.menuOpen}
          onClose={this.handleRequestCloseMenu}
        >
          {this.getMenuItmes()}
        </Menu>
        <UserSettingsDialog
          open={this.state.settingsOpen}
          onClose={this.handleRequestCloseSettings}
        />
      </div>
    );
  }
}

export default compose(
  connect(
    state => ({}),
    {
      clearSessionCache,
      push,
    }
  ),
  injectIntl,
  withStyles(styles),
)(UserInfoDropdown);
