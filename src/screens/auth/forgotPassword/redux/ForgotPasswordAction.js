import AuthApiService from '../../services/AuthApiService';
import { successNotification } from '../../../../common/Toast';
import {
  startGeneralLoaderOnRequest,
  stopGeneralLoaderOnSuccessOrFail,
} from '../../../../common/GeneralLoader/redux/GeneralLoaderAction';
import { displayErrors } from '../../../../helpers/ErrorNotifyHelper';

export const forgotPassword = async email => {
  try {
    startGeneralLoaderOnRequest('forgotPasswordButtonLoaderAction');
    const data = { email };
    const response = await AuthApiService.forgotPassword(data);

    if (response?.data?.status === 'SUCCESS') {
      successNotification('OTP has been sent successfully to your registered email address.');
      stopGeneralLoaderOnSuccessOrFail('forgotPasswordButtonLoaderAction');
    }
  } catch (e) {
    displayErrors(e);
    stopGeneralLoaderOnSuccessOrFail('forgotPasswordButtonLoaderAction');
    throw Error();
  }
};
