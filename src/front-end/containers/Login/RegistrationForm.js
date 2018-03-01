import React from 'react';
import { compose } from 'recompose';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
// import Typography from 'material-ui/Typography';
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

import SuccessButton from '~/components/Buttons/SuccessButton';

class LoginForm extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      showPassword: false,
      agreed: false,
    };
  }

  onAgreementChange = () => {
    this.setState({ agreed: !this.state.agreed });
  };

  handleClickShowPasssword = () => {
    this.setState({ showPassword: !this.state.showPassword });
  };

  render(){
    let {
      usernameText,
      onUsernameChange,
      passwordText,
      onPasswordChange,
      createAccountText,
      onSubmit,
      comfirmUserAgreement = false,
      userAgreementLable,
      classes,
    } = this.props;

    return (
      <div>
        <FormSpace variant="top" />
        <FormContent>
          <FormTextInput
            id="register-username"
            label={usernameText}
            value={this.state.username}
            onChange={onUsernameChange}
          />
          <FormSpace variant="content1" />
          <FormPasswordInput
            id="register-password"
            label={passwordText}
            type={this.state.showPassword ? 'text' : 'password'}
            value={this.state.password}
            onShowPassswordClick={this.handleClickShowPasssword}
            onChange={onPasswordChange}
          />
          <FormSpace variant="content2" />
          {
            !!comfirmUserAgreement && (<FormCheckbox
              dense="true"
              color="primary"
              checked={this.state.agreed}
              onChange={this.onAgreementChange}
              label={userAgreementLable}
            />)
          }
          <FormSpace variant="content2" />
          {
            !comfirmUserAgreement && (userAgreementLable)
          }
          <SuccessButton
            variant="raised"
            fullWidth={true}
            color="primary"
            disabled={comfirmUserAgreement && !this.state.agreed}
            className={classes.loginBtn}
            onTouchTap={onSubmit}
          >
            {createAccountText}
          </SuccessButton>
          <FormSpace variant="content1" />
        </FormContent>
      </div>
    );
  }
}

export default compose(
  withStyles(createFormStyle),
)(LoginForm);
