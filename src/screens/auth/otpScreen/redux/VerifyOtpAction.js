import AuthApiService from '../../services/AuthApiService';
import { successNotification } from '../../../../common/Toast';
import {
  startLoaderButtonOnRequest,
  stopLoaderButtonOnSuccessOrFail,
} from '../../../../common/LoaderButton/redux/LoaderButtonAction';
import { displayErrors } from '../../../../helpers/ErrorNotifyHelper';

export const verifyOtp = async (email, verificationOtp) => {
  try {
    startLoaderButtonOnRequest('verifyOTPButtonLoaderAction');

    const data = { email, verificationOtp };
    const response = await AuthApiService.verifyOtp(data);

    if (response.data.status === 'SUCCESS') {
      const { token } = response.data;
      successNotification('OTP verified successfully.');
      stopLoaderButtonOnSuccessOrFail('verifyOTPButtonLoaderAction');
      return token;
    }

    return null;
  } catch (e) {
    displayErrors(e);
    stopLoaderButtonOnSuccessOrFail('verifyOTPButtonLoaderAction');
    throw Error();
  }
};

export const resendOtp = async email => {
  try {
    startLoaderButtonOnRequest('resendOTPButtonLoaderAction');
    const data = { email };
    const response = await AuthApiService.resentOtp(data);

    if (response.data.status === 'SUCCESS') {
      successNotification('OTP sent successfully.');
      stopLoaderButtonOnSuccessOrFail('resendOTPButtonLoaderAction');
    }
  } catch (e) {
    stopLoaderButtonOnSuccessOrFail('resendOTPButtonLoaderAction');
    displayErrors(e);
    throw Error();
  }
};
