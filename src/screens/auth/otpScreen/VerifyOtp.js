import React, { useState } from 'react';
import './VerifyOtp.scss';
import { Link, useHistory } from 'react-router-dom';
import OtpInput from 'react-otp-input';
import AuthScreenContainer from '../common/CommonAuthScreen/AuthScreenContainer';
import Button from '../../../common/Button/Button';
import BigInput from '../../../common/BigInput/BigInput';
import { errorNotification } from '../../../common/Toast';
import { verifyOtp } from './redux/VerifyOtpAction';
import { SESSION_VARIABLES } from '../../../constants/SessionStorage';

function VerifyOtp() {
  const [otp, setOtp] = useState();
// TODO handle redirect user when directly hit url
  const history = useHistory();

  const onChangeOtp = e => {
    setOtp(e);
  };

  const onClickVerifyOTP = async () => {
    if (otp.toString().trim().length === 0) errorNotification('Please enter otp');
    else if (otp.toString().trim().length !== 6) errorNotification('Please enter a valid otp');
    else {
      try {
        await verifyOtp(otp.trim());
        history.push('/reset-password');
      } catch (e) {
        /**/
      }
    }
  };

  return (
    <AuthScreenContainer>
      <div className="login-field-name">Email or Number</div>
      <BigInput
        prefix="drafts"
        prefixClass="login-input-icon"
        type="email"
        placeholder="Enter email or number"
        value={SESSION_VARIABLES.USER_EMAIL}
        disabled
      />
      <div className="login-field-name">Enter OTP</div>
      <div className="code-container">
        <OtpInput
          value={otp}
          isInputNum
          onChange={onChangeOtp}
          className=""
          numInputs={6}
          separator={<span className="mr-5"> </span>}
        />
      </div>
      <div className="login-action-row">
        <div />
        <Link to="/login">Back To Login</Link>
      </div>
      <Button title="Resend OTP" buttonType="outlined-secondary" />
      <Button title="Submit" buttonType="secondary" className="ml-15" onClick={onClickVerifyOTP} />
    </AuthScreenContainer>
  );
}

export default VerifyOtp;
