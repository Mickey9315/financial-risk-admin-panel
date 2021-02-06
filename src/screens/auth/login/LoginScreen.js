import React, { useState } from 'react';
import './LoginScreen.scss';
import { Link, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import grayLogo from '../../../assets/images/logo-light.svg';
import Button from '../../../common/Button/Button';
import AuthScreenContainer from '../common/CommonAuthScreen/AuthScreenContainer';
import BigInput from '../../../common/BigInput/BigInput';
import Checkbox from '../../../common/Checkbox/Checkbox';
import { loginUser } from './redux/LoginAction';
import { errorNotification } from '../../../common/Toast';
import { checkForEmail, replaceHiddenCharacters } from '../../../helpers/ValidationHelper';

function LoginScreen() {
  const history = useHistory();
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberUser, setRememberUser] = useState(false);

  const onClickLogin = async () => {
    if (email.toString().trim().length === 0) errorNotification('Please enter email');
    else if (!checkForEmail(replaceHiddenCharacters(email)))
      errorNotification('Please enter a valid email');
    else if (replaceHiddenCharacters(password.toString()).trim().length === 0)
      errorNotification('Please enter password');
    else {
      await dispatch(loginUser({ email, password }, rememberUser));
      history.push('/dashboard');
    }
  };

  const onChangeEmail = e => {
    const emailText = e.target.value;

    setEmail(emailText);
  };

  const onChangePassword = e => {
    const passwordText = e.target.value;

    setPassword(passwordText);
  };

  const onChangeRememberUser = e => {
    setRememberUser(e.target.checked);
  };

  return (
    <AuthScreenContainer>
      <div className="login-field-name">Email or Number</div>
      <BigInput
        prefix="drafts"
        prefixClass="login-input-icon"
        type="email"
        placeholder="Enter email or number"
        value={email}
        onChange={onChangeEmail}
      />

      <div className="login-field-name">Password</div>
      <BigInput
        prefix="lock_open"
        prefixClass="login-input-icon"
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={onChangePassword}
      />
      <div className="login-action-row">
        <Checkbox title="Remember me" checked={rememberUser} onChange={onChangeRememberUser} />
        <Link to="/forgot-password/forgot">Forgot Password?</Link>
      </div>
      <Button title="Login" buttonType="secondary" onClick={onClickLogin} />
      <img alt="TCR" className="gray-logo" src={grayLogo} />
    </AuthScreenContainer>
  );
}

export default LoginScreen;
