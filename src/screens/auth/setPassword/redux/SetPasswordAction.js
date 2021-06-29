import AuthApiService from '../../services/AuthApiService';
import { successNotification } from '../../../../common/Toast';
import {
  startGeneralLoaderOnRequest,
  stopGeneralLoaderOnSuccessOrFail,
} from '../../../../common/GeneralLoader/redux/GeneralLoaderAction';
import { displayErrors } from '../../../../helpers/ErrorNotifyHelper';

export const setPassword = async (token, password, cb) => {
  try {
    startGeneralLoaderOnRequest('setPasswordButtonLoaderAction');
    const data = { token, password };

    const response = await AuthApiService.setPassword(data);

    if (response.data.status === 'SUCCESS') {
      successNotification('Password set successfully.');
      stopGeneralLoaderOnSuccessOrFail('setPasswordButtonLoaderAction');
      if (cb) {
        cb();
      }
    }
  } catch (e) {
    stopGeneralLoaderOnSuccessOrFail('setPasswordButtonLoaderAction');
    displayErrors(e);
    throw Error();
  }
};
