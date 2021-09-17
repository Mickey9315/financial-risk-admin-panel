import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AuthScreenContainer from '../common/CommonAuthScreen/AuthScreenContainer';
import Button from '../../../common/Button/Button';
import BigInput from '../../../common/BigInput/BigInput';
import { replaceHiddenCharacters } from '../../../helpers/ValidationHelper';
import { errorNotification } from '../../../common/Toast';
import { useQueryParams } from '../../../hooks/GetQueryParamHook';
import { setPassword } from './redux/SetPasswordAction';
import { PASSWORD_REGEX } from '../../../constants/RegexConstants';

function SetPassword() {
  const [makePassword, setMakePassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordRegexMessage, setIsPasswordRegexMessage] = useState(false);
  const { setPasswordButtonLoaderAction } = useSelector(
    ({ generalLoaderReducer }) => generalLoaderReducer ?? false
  );

  const history = useHistory();
  const { token } = useQueryParams();

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
      setIsPasswordRegexMessage(false);
      errorNotification('Password is empty, please enter the password');
    } else if (!PASSWORD_REGEX.test(makePassword)) {
      setIsPasswordRegexMessage(true);
    } else if (replaceHiddenCharacters(confirmPassword.toString()).trim().length === 0) {
      errorNotification('Re-enter password is empty, please fill it.');
    } else if (makePassword !== confirmPassword) {
      setIsPasswordRegexMessage(false);
      errorNotification('Password and Re-enter password does not match.');
    } else {
      try {
        setIsPasswordRegexMessage(false);
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
      <div>
        <BigInput
          prefix="lock_open"
          prefixClass="login-input-icon"
          type="password"
          placeholder="Enter new password"
          value={makePassword}
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
        placeholder="Re enter Password"
        value={confirmPassword}
        onChange={onChangeConfirmPassword}
        onKeyDown={onEnterKeyPress}
      />
      <Button
        title="Set Password"
        buttonType="secondary"
        className="ml-15 mt-20"
        onClick={onClickSetPassword}
        disabled={setPasswordButtonLoaderAction}
      />
    </AuthScreenContainer>
  );
}

export default SetPassword;
