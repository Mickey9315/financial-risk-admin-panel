import AuthApiService from '../../services/AuthApiService';
import { successNotification } from '../../../../common/Toast';
import {
  startGeneralLoaderOnRequest,
  stopGeneralLoaderOnSuccessOrFail,
} from '../../../../common/GeneralLoader/redux/GeneralLoaderAction';
import { displayErrors } from '../../../../helpers/ErrorNotifyHelper';

export const verifyOtp = async (email, verificationOtp) => {
  try {
    startGeneralLoaderOnRequest('verifyOTPButtonLoaderAction');

    const data = { email, verificationOtp };
    const response = await AuthApiService.verifyOtp(data);

    if (response?.data?.status === 'SUCCESS') {
      const { token } = response.data;
      successNotification('OTP verified successfully.');
      stopGeneralLoaderOnSuccessOrFail('verifyOTPButtonLoaderAction');
      return token;
    }

    return null;
  } catch (e) {
    displayErrors(e);
    stopGeneralLoaderOnSuccessOrFail('verifyOTPButtonLoaderAction');
    throw Error();
  }
};

export const resendOtp = async email => {
  try {
    startGeneralLoaderOnRequest('resendOTPButtonLoaderAction');
    const data = { email };
    const response = await AuthApiService.resentOtp(data);

    if (response?.data?.status === 'SUCCESS') {
      successNotification('OTP sent successfully.');
      stopGeneralLoaderOnSuccessOrFail('resendOTPButtonLoaderAction');
    }
  } catch (e) {
    stopGeneralLoaderOnSuccessOrFail('resendOTPButtonLoaderAction');
    displayErrors(e);
    throw Error();
  }
};
