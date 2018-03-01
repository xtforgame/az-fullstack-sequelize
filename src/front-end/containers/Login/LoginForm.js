import React from 'react';
import { compose } from 'recompose';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import Divider from 'material-ui/Divider';
import {
  createFormStyle,
  FormSpace,
  FormContent,
  FormTextInput,
  FormPasswordInput,
  FormCheckbox,
} from '~/components/SignInSignUp';

class LoginForm extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      showPassword: false,
    };
  }

  handleClickShowPasssword = () => {
    this.setState({ showPassword: !this.state.showPassword });
  };

  render(){
    let {
      rememberUser,
      onRememberUserChange,
      usernameText,
      onUsernameChange,
      passwordText,
      onPasswordChange,
      rememberMeText,
      loginText,
      forgotPasswordText,
      createAccountText,
      onSubmit,
      handleForgotPassword,
      handleCreateAccount,
      classes,
    } = this.props;

    return (
      <div>
        <FormSpace variant="top" />
        <FormContent>
          <FormTextInput
            id="username"
            label={usernameText}
            value={this.state.username}
            onChange={onUsernameChange}
          />
          <FormSpace variant="content1" />
          <FormPasswordInput
            id="password"
            label={passwordText}
            type={this.state.showPassword ? 'text' : 'password'}
            value={this.state.password}
            onShowPassswordClick={this.handleClickShowPasssword}
            onChange={onPasswordChange}
          />
          <FormCheckbox
            dense="true"
            color="primary"
            checked={rememberUser}
            onChange={onRememberUserChange}
            label={rememberMeText}
          />
          <FormSpace variant="content1" />
          <Button variant="raised" fullWidth={true} color="primary" className={classes.loginBtn} onTouchTap={onSubmit}>
            {loginText}
          </Button>
          <FormSpace variant="content1" />
          <Typography
            variant="body1"
            color="secondary"
            align="right"
            className={classes.link}
            onTouchTap={handleForgotPassword}
          >
            {forgotPasswordText}
          </Typography>
          <FormSpace variant="content1" />
        </FormContent>
        <Divider />
        <FormContent>
          <Button fullWidth={true} className={classes.loginBtn} onTouchTap={handleCreateAccount}>
            {createAccountText}
          </Button>
        </FormContent>
      </div>
    );
  }
}

export default compose(
  withStyles(createFormStyle),
)(LoginForm);
