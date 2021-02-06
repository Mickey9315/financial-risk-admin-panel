import React, { useState } from 'react';
import './OtpScreen.scss';
import { Link, useHistory } from 'react-router-dom';
import AuthScreenContainer from '../common/CommonAuthScreen/AuthScreenContainer';
import Button from '../../../common/Button/Button';
import BigInput from '../../../common/BigInput/BigInput';
import { errorNotification } from '../../../common/Toast';
import { verifyOtp } from './redux/VerifyOtpAction';

function VerifyOtp() {
  const [otp, setOtp] = useState();

  const history = useHistory();

  const onChangeOtp = e => {
    const otpText = e.target.value;

    setOtp(otpText);
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
        value={otp}
        onChange={onChangeOtp}
      />
      <div className="login-field-name">Enter OTP</div>
      <div className="otp-row">
        <div className="login-input">
          <input maxLength="1" placeholder="0" />
        </div>
        <div className="login-input">
          <input maxLength="1" placeholder="0" />
        </div>
        <div className="login-input">
          <input maxLength="1" placeholder="0" />
        </div>
        <div className="login-input">
          <input maxLength="1" placeholder="0" />
        </div>
        <div className="login-input">
          <input maxLength="1" placeholder="0" />
        </div>
        <div className="login-input">
          <input maxLength="1" placeholder="0" />
        </div>
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

// TODO handle resent OTP
