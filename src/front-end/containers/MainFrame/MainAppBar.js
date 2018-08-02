// @flow weak

import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import LocaleDropdown from '~/containers/LocaleDropdown';
import UserInfoDropdown from '~/containers/UserInfoDropdown';

import { compose } from 'recompose';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { messages } from '../App/translation';
import createCommonStyles from '~/styles/common';

const styles = theme => ({
  root: {
    // marginTop: theme.spacing.unit * 3,
    width: '100%',
  },
  ...createCommonStyles(theme, ['flex', 'appBar']),
});

class MainAppBar extends React.Component {
  render() {
    const {
      classes, onToggleMenu = () => {},
    } = this.props;
    return (
      <div className={classes.root}>
        <AppBar position="fixed">
          <Toolbar>
            <IconButton color="inherit" className={classes.menuButton} onClick={onToggleMenu} aria-label="Menu">
              <MenuIcon />
            </IconButton>
            <Typography variant="title" color="inherit" className={classes.flex1}>
              <FormattedMessage {...messages.appTitle} />
            </Typography>
            <LocaleDropdown />
            {/* <Button color="inherit" onClick={() => clearSessionCache('me')}>
              <FormattedMessage {...messages.logout} />
            </Button> */}
            <UserInfoDropdown />
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}


export default compose(
  connect(
    state => ({}),
    {}
  ),
  withStyles(styles),
)(MainAppBar);
