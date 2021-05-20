import AuthApiService from '../../services/AuthApiService';
import { successNotification } from '../../../../common/Toast';
import {
  startLoaderButtonOnRequest,
  stopLoaderButtonOnSuccessOrFail,
} from '../../../../common/LoaderButton/redux/LoaderButtonAction';
import { displayErrors } from '../../../../helpers/ErrorNotifyHelper';

export const setPassword = async (token, password, cb) => {
  try {
    startLoaderButtonOnRequest('setPasswordButtonLoaderAction');
    const data = { token, password };

    const response = await AuthApiService.setPassword(data);

    if (response.data.status === 'SUCCESS') {
      successNotification('Password set successfully.');
      stopLoaderButtonOnSuccessOrFail('setPasswordButtonLoaderAction');
      if (cb) {
        cb();
      }
    }
  } catch (e) {
    stopLoaderButtonOnSuccessOrFail('setPasswordButtonLoaderAction');
    displayErrors(e);
    throw Error();
  }
};
