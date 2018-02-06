import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Paper from 'material-ui/Paper';
import { FormattedMessage } from 'react-intl';
import formatMessage from '~/utils/formatMessage';
import {
  withRouter,
} from 'react-router-dom';
import { messages } from '../App/translation';
import {
  Redirect,
} from 'react-router-dom';
import Tabs, { Tab } from 'material-ui/Tabs';
import Typography from 'material-ui/Typography';
import LocaleDropdown from '~/containers/LocaleDropdown'

import { FormControl, FormHelperText } from 'material-ui/Form';
import Input, { InputLabel, InputAdornment } from 'material-ui/Input';

import IconButton from 'material-ui/IconButton';
import Visibility from 'material-ui-icons/Visibility';
import VisibilityOff from 'material-ui-icons/VisibilityOff';
import Button from 'material-ui/Button';

import { createStructuredSelector } from 'reselect';
import modelMap from '~/containers/App/modelMap';
import {
  makeUserSessionSelector,
} from '~/containers/App/selectors';

const {
  createSession,
  createSessionCancel,
} = modelMap.actions;

function TabContainer(props) {
  return <div style={{ padding: 8 * 3 }}>{props.children}</div>;
}

const styles = theme => ({
  flexContainer: {
    display: 'flex',
  },
  placeholder1: {
    height: '20%',
  },
  placeholder2: {
    height: '5%',
  },
  spacing: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  paper: {
    margin: 80,
    width: 500,
    paddingRight: 0,
    paddingLeft: 0,
    height: 500,
  },
  mainArea: {
    flex: 4,
    margin: theme.spacing.unit,
  },
  loginBtn: {
    float: 'right',
  },
  username: {
  },
  toolBar: {
    // minHeight: 48,
    // height: 48,
  }
});

class Login extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      username: '',
      password: '',
      showPassword: false,
    };
  }

  handleChange = prop => event => {
    this.setState({ [prop]: event.target.value });
  };

  handleMouseDownPassword = event => {
    event.preventDefault();
  };

  handleClickShowPasssword = () => {
    this.setState({ showPassword: !this.state.showPassword });
  };

  render(){
    let { location, intl, createSession, session, classes } = this.props;
    let fromPath = location.state && location.state.from.pathname;
    let usernameText = formatMessage(intl, messages.username, {});
    let passwordText = formatMessage(intl, messages.password, {});

    if(session){
      fromPath = fromPath || '/';
      return (
        <Redirect to={{
          pathname: fromPath,
        }}/>
      );
    }else{
      fromPath && console.log(`Redirected page from ${fromPath} to Login`);
    }
    return (
      <div className={classes.flexContainer}>
        <div className={classes.spacing} />
        <Paper className={classes.paper} elevation={4}>
          <AppBar position="static">
            <Toolbar className={classes.toolBar}>
              <Typography type="title" color="inherit" className={classes.flex}>
                <FormattedMessage {...messages.login} />
              </Typography>
              <LocaleDropdown />
            </Toolbar>
          </AppBar>
          <div className={classes.placeholder1} />
          <div className={classes.flexContainer}>
            <div className={classes.flex} />
            <FormControl className={classes.mainArea}>
              <InputLabel htmlFor="username">{usernameText}</InputLabel>
              <Input
                id="username"
                label={usernameText}
                className={classes.username}
                value={this.state.username}
                onChange={this.handleChange('username')}
              />
            </FormControl>
            <div className={classes.flex} />
          </div>
          <div className={classes.flexContainer}>
            <div className={classes.flex} />
            <FormControl className={classes.mainArea}>
              <InputLabel htmlFor="password">{passwordText}</InputLabel>
              <Input
                id="password"
                label={passwordText}
                type={this.state.showPassword ? 'text' : 'password'}
                value={this.state.password}
                onChange={this.handleChange('password')}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      onClick={this.handleClickShowPasssword}
                      onMouseDown={this.handleMouseDownPassword}
                    >
                      {this.state.showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
            <div className={classes.flex} />
          </div>
          <div className={classes.placeholder2} />
          <div className={classes.flexContainer}>
            <div className={classes.flex} />
            <div className={classes.mainArea}>
              <Button className={classes.loginBtn} onTouchTap={() => {
                createSession({
                  auth_type: 'basic',
                  username: 'admin',
                  password: 'admin',
                });
              }}>
                {formatMessage(intl, messages.login, {})}
              </Button>
            </div>
            <div className={classes.flex} />
          </div>
        </Paper>
        <div className={classes.spacing} />
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  session: makeUserSessionSelector(),
});

export default compose(
  connect(
    mapStateToProps,
    {
      createSession,
      createSessionCancel,
    }
  ),
  injectIntl,
  withStyles(styles),
)(Login);
