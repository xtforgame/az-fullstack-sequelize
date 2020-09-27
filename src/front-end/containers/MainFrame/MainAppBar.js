// @flow weak

import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Link from '@material-ui/core/Link';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import NotificationsIcon from '@material-ui/icons/Notifications';

import { compose } from 'recompose';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import createCommonStyles from 'azrmui/styles/common';
import UserInfoDropdown from '~/containers/UserInfoDropdown';
import LocaleDropdown from '~/containers/LocaleDropdown';

const styles = theme => ({
  root: {
    // marginTop: theme.spacing(3),
    width: '100%',
  },
  ...createCommonStyles(theme, ['flex', 'appBar']),
  appBar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  toolbar: {
    flexWrap: 'wrap',
  },
  toolbarTitle: {
    flexGrow: 1,
  },
  link: {
    color: 'white',
    margin: theme.spacing(1, 1.5),
  },
  heroContent: {
    padding: theme.spacing(8, 0, 6),
  },
  cardHeader: {
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[200] : theme.palette.grey[700],
  },
  cardPricing: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'baseline',
    marginBottom: theme.spacing(2),
  },
  footer: {
    borderTop: `1px solid ${theme.palette.divider}`,
    marginTop: theme.spacing(8),
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    [theme.breakpoints.up('sm')]: {
      paddingTop: theme.spacing(6),
      paddingBottom: theme.spacing(6),
    },
  },
});

class MainAppBar extends React.PureComponent {
  render() {
    const {
      t,
      classes,
      isUserLoggedIn = true,
      onToggleMenu = () => {},
      onToggleNotificationPanel = () => {},
    } = this.props;
    return (
      <div className={classes.root}>
        <AppBar position="fixed" color="primary" elevation={0} className={classes.appBar}>
          <Toolbar className={classes.toolbar}>
            <Typography variant="h6" color="inherit" noWrap className={classes.toolbarTitle}>
              {'<LOGO>'}
            </Typography>
            <nav>
              <Link variant="button" href="#" className={classes.link}>
                關於訂銳
              </Link>
              <Link variant="button" href="#" className={classes.link}>
                合作項目
              </Link>
              <Link variant="button" href="#" className={classes.link}>
                技術支援
              </Link>
            </nav>
            <Button href="#" color="primary" variant="outlined" className={classes.link}>
              登入會員
            </Button>
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
  withTranslation(['app-common']),
  withStyles(styles),
)(MainAppBar);
