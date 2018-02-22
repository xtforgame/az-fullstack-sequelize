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
import {
  rememberMe,
} from '../App/actions';
import { messages } from '../App/translation';
import {
  Redirect,
} from 'react-router-dom';
import Typography from 'material-ui/Typography';
import LocaleDropdown from '~/containers/LocaleDropdown'

import IconButton from 'material-ui/IconButton';
import ArrowBack from 'material-ui-icons/ArrowBack';

import SwipeableViews from 'react-swipeable-views';
import LoginForm from './LoginForm';
import RegistrationForm from './RegistrationForm';

import {
  createFormStyle,
} from '~/components/SignInSignUp';
import { createStructuredSelector } from 'reselect';
import modelMap from '~/containers/App/modelMap';
import {
  makeUserSessionSelector,
  makeRememberUserSelector,
} from '~/containers/App/selectors';

import popup from './popup';

const {
  createSession,
  createSessionCancel,
} = modelMap.actions;
const styles = theme => ({
  ...createFormStyle(theme),
  flexContainer: {
    display: 'flex',
    height: '100%',
  },
  spacing: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  paper: {
    margin: 0,
    width: '100%',
    paddingRight: 0,
    paddingLeft: 0,
    height: '100%',
    [theme.breakpoints.up('sm')]: {
      width: 500,
      margin: 80,
      height: 470,
    },
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  toolBar: {
    // minHeight: 48,
    // height: 48,
  },
});

const LinkInternal = ({text, url, classes}) => (
  <a
    className={classes.link}
    onTouchTap={event => {
      event.stopPropagation();
      event.preventDefault();
    }}
  >{text}</a>
);

const Link = compose(
  withStyles(styles),
)(LinkInternal)

class Login extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      username: '',
      password: '',
      tabIndex: 0,
    };
  }

  handleChange = prop => event => {
    this.setState({ [prop]: event.target.value });
  };

  handleRememberUserChange = (event, checked) => {
    let { rememberUser, rememberMe } = this.props;
    rememberMe(!rememberUser);
  };

  componentWillMount(){
    let { location, session } = this.props;
    let fromPath = location.state && location.state.from.pathname;
    if(!session){
      fromPath && console.log(`Redirected page from ${fromPath} to Login`);
    }
  }

  swipeTo = (tabIndex) => {
    this.setState({ tabIndex });
  };

  render(){
    let { location, intl, createSession, session, rememberUser, classes } = this.props;
    let fromPath = location.state && location.state.from.pathname;
    let usernameText = formatMessage(intl, messages.username, {});
    let passwordText = formatMessage(intl, messages.password, {});
    let loginText = formatMessage(intl, messages.login, {});
    let rememberMeText = formatMessage(intl, messages.rememberMe, {});
    let forgotPasswordText = formatMessage(intl, messages.forgotPasswordQuestion, {});
    let createAccountText = formatMessage(intl, messages.createAccount, {});

    let createAccountV = formatMessage(intl, messages.createAccountV, {});
    let terms = formatMessage(intl, messages.terms, {});
    let privacyPolicy = formatMessage(intl, messages.privacyPolicy, {});

    if(session){
      fromPath = fromPath || '/';
      return (
        <Redirect to={{
          pathname: fromPath,
        }}/>
      );
    }

    let login = () => {
      popup('/auth-popup.html');
      return ;
      createSession({
        auth_type: 'basic',
        username: 'admin',
        password: 'admin',
      });
    };

    let userAgreementLable = (
      <FormattedMessage
        {...messages.userAgreement}
        values={{
          createAccountV,
          terms: (<Link key="terms" text={terms} />),
          privacyPolicy: (<Link key="privacyPolicy" text={privacyPolicy} />),
        }}
      >
        {(...parts) => {
          return (
            <Typography
              variant="body1"
              className={classes.textContainer}
              onClick={event => {
                event.stopPropagation();
                event.preventDefault();
              }}
              onMouseDown={event => {
                event.stopPropagation();
                event.preventDefault();
              }}
              onTouchTap={event => {
                event.stopPropagation();
                event.preventDefault();
              }}
            >
              {parts}
            </Typography>
          );
        }}
      </FormattedMessage>
    );

    return (
      <div className={classes.flexContainer}>
        <div className={classes.spacing} />
        <Paper className={classes.paper} elevation={4}>
          <AppBar position="static">
            <Toolbar className={classes.toolBar}>
              {!!this.state.tabIndex && <IconButton className={classes.menuButton} color="inherit" aria-label="Back" onTouchTap={() => { this.swipeTo(0); }}>
                <ArrowBack/>
              </IconButton>}
              <Typography variant="title" color="inherit" className={classes.flex}>
                {
                  this.state.tabIndex ? <FormattedMessage {...messages.createAccount} />
                  : <FormattedMessage {...messages.login} />
                }
              </Typography>
              <LocaleDropdown />
            </Toolbar>
          </AppBar>
          <SwipeableViews
            index={this.state.tabIndex}
            {...{}/*onChangeIndex={this.handleChangeIndex}*/}
            disabled={true}
          >
            <LoginForm
              usernameText={usernameText}
              passwordText={passwordText}
              rememberMeText={rememberMeText}
              rememberUser={rememberUser}
              loginText={loginText}
              forgotPasswordText={forgotPasswordText}
              createAccountText={createAccountText}
              onRememberUserChange={this.handleRememberUserChange}
              onUsernameChange={this.handleChange('username')}
              onPasswordChange={this.handleChange('password')}
              onSubmit={login}
              handleForgotPassword={() => this.swipeTo(1)}
              handleCreateAccount={() => this.swipeTo(1)}
            />
            <RegistrationForm
              usernameText={usernameText}
              passwordText={passwordText}
              createAccountText={createAccountV}
              onUsernameChange={this.handleChange('username')}
              onPasswordChange={this.handleChange('password')}
              onSubmit={login}
              comfirmUserAgreement={true}
              userAgreementLable={userAgreementLable}
            />
            <div>slide n°3</div>
          </SwipeableViews>
        </Paper>
        <div className={classes.spacing} />
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  session: makeUserSessionSelector(),
  rememberUser: makeRememberUserSelector(),
});

export default compose(
  connect(
    mapStateToProps,
    {
      createSession,
      createSessionCancel,
      rememberMe,
    }
  ),
  injectIntl,
  withStyles(styles),
)(Login);
