import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Paper from '@material-ui/core/Paper';
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
import Typography from '@material-ui/core/Typography';
import LocaleDropdown from '~/containers/LocaleDropdown'

import IconButton from '@material-ui/core/IconButton';
import ArrowBack from '@material-ui/icons/ArrowBack';
import createCommonStyles from '~/styles/common';
import createFormPaperStyle from '~/styles/FormPaper';

import { FormPhoneOrEmailInput } from '~/components/SignInSignUp';
import SwipeableViews from 'react-swipeable-views';
import LoginForm from './LoginForm';
import RegistrationForm from './RegistrationForm';
import RecoveryForm from '~/containers/Recovery/RecoveryForm';

import { createStructuredSelector } from 'reselect';
import modelMap from '~/containers/App/modelMap';
import {
  makeUserSessionSelector,
  makeRememberUserSelector,
} from '~/containers/App/selectors';

const {
  postSessions,
  postUsers,
} = modelMap.waitableActions;

const {
  cancelPostSessions,
  cancelPostUsers,
} = modelMap.actions;

const styles = theme => ({
  ...createFormPaperStyle(theme),
  ...createCommonStyles(theme, ['flex', 'appBar']),
});

class Login extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      tabIndex: 0,
      // username: FormPhoneOrEmailInput.rawInputToState('admin@foo.bar'),
      loginError: null,
      postUsersError: null,
    };
  }

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
    let { location, intl, postSessions, postUsers, postRecoveryTokens, session, rememberUser, classes } = this.props;
    let fromPath = location.state && location.state.from.pathname;
    const wrongUsernameOrPassword = formatMessage(intl, messages.wrongUsernameOrPassword, {});
    const usernameIsTaken = formatMessage(intl, messages.usernameIsTaken, {});

    if(session){
      fromPath = fromPath || '/';
      return (
        <Redirect to={{
          pathname: fromPath,
        }}/>
      );
    }

    const login = (username, password, rememberUser) => {
      const { rememberMe } = this.props;
      rememberMe(rememberUser);
      // popup('/auth-popup.html');
      // return ;
      postSessions({
        auth_type: 'basic',
        username,
        password,
      })
      .catch(action => {
        this.setState({
          loginError: action.data.error,
        });
      });
    };

    const register = (username, password) => {
      postUsers({
        name: username,
        privilege: 'admin',
        accountLinks: [{
          auth_type: 'basic',
          username,
          password,
        }],
      })
      .catch(action => {
        this.setState({
          postUsersError: action.data.error,
        });
      });
    };

    let title = null;
    switch (this.state.tabIndex) {
      case 0:
        title = <FormattedMessage {...messages.login} />;
        break;

      case 1:
        title = <FormattedMessage {...messages.createAccount} />;
        break;

      case 2:
        title = <FormattedMessage {...messages.forgotPasswordQuestion} />;
        break;
    }

    return (
      <div className={classes.flexContainerFH}>
        <div className={classes.flex1} />
        <Paper className={classes.paper} elevation={4}>
          <AppBar position="static">
            <Toolbar>
              {this.state.tabIndex !== 0 && <IconButton className={classes.menuButton} color="inherit" aria-label="Back" onClick={() => { this.swipeTo(0); }}>
                <ArrowBack/>
              </IconButton>}
              <Typography variant="title" color="inherit" className={classes.flex1}>
                {title}
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
              username={this.state.username}
              onUsernameChange={(username) => this.setState({
                username,
              })}
              usernameError={this.state.tabIndex === 0 && !!this.state.loginError}
              passwordError={this.state.tabIndex === 0 && this.state.loginError && wrongUsernameOrPassword}
              defaultRememberMe={rememberUser}
              onSubmit={login}
              handleForgotPassword={() => this.swipeTo(2)}
              handleCreateAccount={() => this.swipeTo(1)}
            />
            <RegistrationForm
              username={this.state.username}
              onUsernameChange={(username) => this.setState({
                username,
              })}
              usernameError={this.state.tabIndex === 1 && this.state.postUsersError && usernameIsTaken}
              onSubmit={register}
              comfirmUserAgreement={true}
            />
            <RecoveryForm
              username={this.state.username}
              onUsernameChange={(username) => this.setState({
                username,
              })}
              usernameError={this.state.tabIndex === 2 && this.state.postUsersError && usernameIsTaken}
              onBackToLogin={() => this.swipeTo(0)}
            />
          </SwipeableViews>
        </Paper>
        <div className={classes.flex1} />
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
      postSessions,
      cancelPostSessions,
      postUsers,
      cancelPostUsers,
      rememberMe,
    }
  ),
  injectIntl,
  withStyles(styles),
)(Login);
