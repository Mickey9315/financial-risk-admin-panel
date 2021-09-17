import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AuthScreenContainer from '../common/CommonAuthScreen/AuthScreenContainer';
import Button from '../../../common/Button/Button';
import BigInput from '../../../common/BigInput/BigInput';
import { replaceHiddenCharacters } from '../../../helpers/ValidationHelper';
import { errorNotification } from '../../../common/Toast';
import { resetPassword } from './redux/ResetPasswordAction';
import { useQueryParams } from '../../../hooks/GetQueryParamHook';
import { PASSWORD_REGEX } from '../../../constants/RegexConstants';

function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordRegexMessage, setIsPasswordRegexMessage] = useState(false);

  const history = useHistory();
  const { token } = useQueryParams();

  const { resetPasswordButtonLoaderAction } = useSelector(
    ({ generalLoaderReducer }) => generalLoaderReducer ?? false
  );

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
      setIsPasswordRegexMessage(false);
      errorNotification('Password is empty, please enter the password');
    } else if (!PASSWORD_REGEX.test(password)) {
      setIsPasswordRegexMessage(true);
    } else if (replaceHiddenCharacters(confirmPassword.toString()).trim().length === 0) {
      errorNotification('Re-enter password is empty, please fill it.');
    } else if (password !== confirmPassword) {
      setIsPasswordRegexMessage(false);
      errorNotification('Password and Re-enter password does not match.');
    } else {
      try {
        setIsPasswordRegexMessage(false);
        await resetPassword(token, password.toString().trim());
        history.replace('/login');
      } catch (e) {
        /**/
      }
    }
  };

  const onEnterKeyPress = async e => {
    if (e.keyCode === 13) {
      await onClickResetPassword();
    }
  };

  return (
    <AuthScreenContainer>
      <div className="login-field-name">New Password</div>
      <div>
        <BigInput
          prefix="lock_open"
          prefixClass="login-input-icon"
          type="password"
          placeholder="Enter New password"
          value={password}
          onChange={onChangePassword}
          onKeyDown={onEnterKeyPress}
        />
        {isPasswordRegexMessage && (
          <div className="ui-state-error">
            Your password should include 8 or more than 8 characters with at least one special
            character, a number, one uppercase character and a lowercase character
          </div>
        )}
      </div>
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
      <div className="login-action-row">
        <div />
        <Link to="/login" className="login-module-link">
          Back To Login
        </Link>
      </div>
      <Button
        title="Set New Password"
        buttonType="secondary"
        className="ml-15"
        onClick={onClickResetPassword}
        disabled={resetPasswordButtonLoaderAction}
      />
    </AuthScreenContainer>
  );
}

export default ResetPassword;
