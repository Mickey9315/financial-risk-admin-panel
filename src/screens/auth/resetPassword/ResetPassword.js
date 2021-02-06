import React, { useState } from 'react';
import './ResetPassword.scss';
import { Link, useHistory } from 'react-router-dom';
import AuthScreenContainer from '../common/CommonAuthScreen/AuthScreenContainer';
import Button from '../../../common/Button/Button';
import BigInput from '../../../common/BigInput/BigInput';
import { replaceHiddenCharacters } from '../../../helpers/ValidationHelper';
import { errorNotification } from '../../../common/Toast';
import { resetPassword } from './redux/ResetPasswordAction';

function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const history = useHistory();

  const onChangePassword = e => {
    const changedPassword = e.target.value;

    setPassword(changedPassword);
  };

  const onChangeConfirmPassword = e => {
    const changedConfirmPassword = e.target.value;

    setConfirmPassword(changedConfirmPassword);
  };

  const onClickResetPassword = async () => {
    if (replaceHiddenCharacters(password.toString()).trim().length === 0) {
      errorNotification('Password can not be empty');
    } else if (replaceHiddenCharacters(confirmPassword.toString()).trim().length === 0) {
      errorNotification('Re-enter password can not be empty');
    } else if (password !== confirmPassword) {
      errorNotification('Both passwords should match');
    } else {
      try {
        await resetPassword(password.toString().trim());
        history.replace('/login');
      } catch (e) {
        /**/
      }
    }
  };

  return (
    <AuthScreenContainer>
      <div className="login-field-name">New Password</div>
      <BigInput
        prefix="lock_open"
        prefixClass="login-input-icon"
        type="password"
        placeholder="Enter New password"
        value={password}
        onChange={onChangePassword}
      />
      <div className="login-field-name">Re-enter Password</div>
      <BigInput
        prefix="lock_open"
        prefixClass="login-input-icon"
        type="password"
        placeholder="Re Enter password"
        value={confirmPassword}
        onChange={onChangeConfirmPassword}
      />
      <div className="login-action-row">
        <div />
        <Link to="/login">Back To Login</Link>
      </div>
      <Button
        title="Set New Password"
        buttonType="secondary"
        className="ml-15"
        onClick={onClickResetPassword}
      />
    </AuthScreenContainer>
  );
}

export default ResetPassword;
