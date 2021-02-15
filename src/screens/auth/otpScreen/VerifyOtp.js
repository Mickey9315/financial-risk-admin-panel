import React, { useState } from 'react';
import './VerifyOtp.scss';
import { Link, useHistory } from 'react-router-dom';
import OtpInput from 'react-otp-input';
import AuthScreenContainer from '../common/CommonAuthScreen/AuthScreenContainer';
import Button from '../../../common/Button/Button';
import BigInput from '../../../common/BigInput/BigInput';
import { errorNotification } from '../../../common/Toast';
import { resendOtp, verifyOtp } from './redux/VerifyOtpAction';
import { useQueryParams } from '../../../hooks/GetQueryParamHook';

function VerifyOtp() {
  const [otp, setOtp] = useState('');
  const history = useHistory();
  const { email } = useQueryParams();

  const onChangeOtp = e => {
    setOtp(e);
  };

  const onClickVerifyOTP = async () => {
    if (otp.toString().trim().length === 0) errorNotification('Please enter otp');
    else if (otp.toString().trim().length !== 6) errorNotification('Please enter a valid otp');
    else {
      try {
        const token = await verifyOtp(email.trim(), otp.trim());
        if (token) {
          history.replace(`/reset-password?token=${token}`);
        }
      } catch (e) {
        /**/
      }
    }
  };

  const resendOTP = async () => {
    if (email) {
      await resendOtp(email);
    }
  };

  return (
    <AuthScreenContainer>
      <div className="login-field-name disabled">Email or Number</div>
      <BigInput
        prefix="drafts"
        className="disabled"
        prefixClass="login-input-icon disabled-icon"
        type="email"
        placeholder="Enter email or number"
        value={email}
        disabled
      />
      <div className="login-field-name">Enter OTP</div>
      <div className="code-container">
        <OtpInput
          value={otp}
          isInputNum
          onChange={onChangeOtp}
          className=""
          placeholder="0"
          numInputs={6}
          separator={<span className="mr-5"> </span>}
        />
      </div>
      <div className="login-action-row">
        <div />
        <Link to="/login">Back To Login</Link>
      </div>
      <Button title="Resend OTP" buttonType="outlined-secondary" onClick={resendOTP} />
      <Button title="Submit" buttonType="secondary" className="ml-15" onClick={onClickVerifyOTP} />
    </AuthScreenContainer>
  );
}

export default VerifyOtp;
