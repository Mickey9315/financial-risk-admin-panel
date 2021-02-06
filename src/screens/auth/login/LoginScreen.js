import React from 'react';
import './LoginScreen.scss';
import grayLogo from '../../../assets/images/logo-light.svg';
import Button from '../../../common/Button/Button';
import AuthScreenContainer from '../common/CommonAuthScreen/AuthScreenContainer';
import BigInput from '../../../common/BigInput/BigInput';
import Checkbox from '../../../common/Checkbox/Checkbox';

function LoginScreen() {
  return (
    <AuthScreenContainer>
      <div className="login-field-name">Email or Number</div>
      <BigInput
        prefix="drafts"
        prefixClass="login-input-icon"
        type="email"
        placeholder="Enter email or number"
      />

      <div className="login-field-name">Password</div>
      <BigInput
        prefix="lock_open"
        prefixClass="login-input-icon"
        type="password"
        placeholder="Enter password"
      />
      <div className="login-action-row">
        <Checkbox title="Remember me" checked={false} />
        <a href="/">Forgot Password?</a>
      </div>

      <Button title="Login" buttonType="secondary" />
      <img alt="TCR" className="gray-logo" src={grayLogo} />
    </AuthScreenContainer>
  );
}

export default LoginScreen;
