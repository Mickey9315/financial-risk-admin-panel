import AuthApiService from '../../services/AuthApiService';
import { successNotification } from '../../../../common/Toast';
import {
  startLoaderButtonOnRequest,
  stopLoaderButtonOnSuccessOrFail,
} from '../../../../common/LoaderButton/redux/LoaderButtonAction';
import { displayErrors } from '../../../../helpers/ErrorNotifyHelper';

export const forgotPassword = async email => {
  try {
    startLoaderButtonOnRequest('forgotPasswordButtonLoaderAction');
    const data = { email };
    const response = await AuthApiService.forgotPassword(data);

    if (response.data.status === 'SUCCESS') {
      successNotification('OTP has been sent successfully to your registered email address.');
      stopLoaderButtonOnSuccessOrFail('forgotPasswordButtonLoaderAction');
    }
  } catch (e) {
    displayErrors(e);
    stopLoaderButtonOnSuccessOrFail('forgotPasswordButtonLoaderAction');
    throw Error();
  }
};
