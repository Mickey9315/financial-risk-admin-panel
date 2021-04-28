import React, { useState } from 'react';
import './SetPassword.scss';
import { useHistory } from 'react-router-dom';
import AuthScreenContainer from '../common/CommonAuthScreen/AuthScreenContainer';
import Button from '../../../common/Button/Button';
import BigInput from '../../../common/BigInput/BigInput';
import { replaceHiddenCharacters } from '../../../helpers/ValidationHelper';
import { errorNotification } from '../../../common/Toast';
import { useQueryParams } from '../../../hooks/GetQueryParamHook';
import { setPassword } from './redux/SetPasswordAction';

function SetPassword() {
  const [makePassword, setMakePassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const history = useHistory();
  const { token } = useQueryParams();
  console.log('token->', token);
  const onChangePassword = e => {
    const changedPassword = e.target.value;
    setMakePassword(changedPassword);
  };

  const onChangeConfirmPassword = e => {
    const changedConfirmPassword = e.target.value;
    setConfirmPassword(changedConfirmPassword);
  };

  const onClickSetPassword = async () => {
    if (replaceHiddenCharacters(makePassword.toString()).trim().length === 0) {
      errorNotification('Password is empty, please enter the password');
    } else if (replaceHiddenCharacters(confirmPassword.toString()).trim().length === 0) {
      errorNotification('Re-enter password is empty, please fill it.');
    } else if (makePassword !== confirmPassword) {
      errorNotification('Password and Re-enter password does not match.');
    } else {
      try {
        await setPassword(token, makePassword.toString().trim(), () => history.replace('/login'));
      } catch (e) {
        /**/
      }
    }
  };

  const onEnterKeyPress = async e => {
    if (e.keyCode === 13) {
      await onClickSetPassword();
    }
  };

  return (
    <AuthScreenContainer>
      <div className="login-field-name">Set Password</div>
      <BigInput
        prefix="lock_open"
        prefixClass="login-input-icon"
        type="password"
        placeholder="Enter New password"
        value={makePassword}
        onChange={onChangePassword}
        onKeyDown={onEnterKeyPress}
      />
      <div className="login-field-name">Re Enter password</div>
      <BigInput
        prefix="lock_open"
        prefixClass="login-input-icon"
        type="password"
        placeholder="Re Enter password"
        value={confirmPassword}
        onChange={onChangeConfirmPassword}
        onKeyDown={onEnterKeyPress}
      />
      <Button
        title="Set Password"
        buttonType="secondary"
        className="ml-15 mt-20"
        onClick={onClickSetPassword}
      />
    </AuthScreenContainer>
  );
}

export default SetPassword;
