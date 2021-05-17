import AuthApiService from '../../services/AuthApiService';
import { successNotification } from '../../../../common/Toast';
import {
  startLoaderButtonOnRequest,
  stopLoaderButtonOnSuccessOrFail,
} from '../../../../common/LoaderButton/redux/LoaderButtonAction';
import { displayErrors } from '../../../../helpers/ErrorNotifyHelper';

export const resetPassword = async (token, password) => {
  try {
    startLoaderButtonOnRequest('resetPasswordButtonLoaderAction');
    const data = { token, password };
    const response = await AuthApiService.resetPassword(data);

    if (response.data.status === 'SUCCESS') {
      successNotification('Password changed successfully.');
      stopLoaderButtonOnSuccessOrFail('resetPasswordButtonLoaderAction');
    }
  } catch (e) {
    stopLoaderButtonOnSuccessOrFail('resetPasswordButtonLoaderAction');
    displayErrors(e);
    throw Error();
  }
};
