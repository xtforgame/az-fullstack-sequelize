import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { injectIntl, FormattedMessage } from 'react-intl';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Paper from '@material-ui/core/Paper';
import formatMessage from '~/utils/formatMessage';
import {
  Redirect,
} from 'react-router-dom';
import {
  rememberMe,
} from '../App/actions';
import { messages } from '../App/translation';
import Typography from '@material-ui/core/Typography';
import LocaleDropdown from '~/containers/LocaleDropdown';

import createCommonStyles from '~/styles/common';
import createFormPaperStyle from '~/styles/FormPaper';

import LoginForm from './LoginForm';

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
  constructor(props) {
    super(props);
    this.state = {
      // username: FormPhoneOrEmailInput.rawInputToState('admin@foo.bar'),
      loginError: null,
    };
  }

  componentWillMount() {
    const { location, session } = this.props;
    const fromPath = location.state && location.state.from.pathname;
    if (!session && fromPath) {
      console.warn(`Redirected page from ${fromPath} to Login`);
    }
  }

  render() {
    const {
      location, intl, postSessions, session, rememberUser, classes,
    } = this.props;
    let fromPath = location.state && location.state.from.pathname;
    const wrongUsernameOrPassword = formatMessage(intl, messages.wrongUsernameOrPassword, {});
    // const usernameIsTaken = formatMessage(intl, messages.usernameIsTaken, {});

    if (session) {
      fromPath = fromPath || '/';
      return (
        <Redirect to={{
          pathname: fromPath,
        }}
        />
      );
    }

    const login = (username, password, rememberUser) => {
      const { rememberMe } = this.props;
      rememberMe(rememberUser);
      postSessions({
        auth_type: 'basic',
        username,
        password,
      })
      .catch((action) => {
        this.setState({
          loginError: action.data.error,
        });
      });
    };

    return (
      <div className={classes.flexContainerFH}>
        <div className={classes.flex1} />
        <Paper className={classes.paper} elevation={4}>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="title" color="inherit" className={classes.flex1}>
                <FormattedMessage {...messages.login} />
              </Typography>
              <LocaleDropdown />
            </Toolbar>
          </AppBar>
          <LoginForm
            username={this.state.username}
            onUsernameChange={username => this.setState({
              username,
            })}
            usernameError={!!this.state.loginError}
            passwordError={this.state.loginError && wrongUsernameOrPassword}
            defaultRememberMe={rememberUser}
            onSubmit={login}
          />
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
