import AuthApiService from '../../services/AuthApiService';
import { successNotification } from '../../../../common/Toast';
import {
  startGeneralLoaderOnRequest,
  stopGeneralLoaderOnSuccessOrFail,
} from '../../../../common/GeneralLoader/redux/GeneralLoaderAction';
import { displayErrors } from '../../../../helpers/ErrorNotifyHelper';

export const resetPassword = async (token, password) => {
  try {
    startGeneralLoaderOnRequest('resetPasswordButtonLoaderAction');
    const data = { token, password };
    const response = await AuthApiService.resetPassword(data);

    if (response.data.status === 'SUCCESS') {
      successNotification('Password changed successfully.');
      stopGeneralLoaderOnSuccessOrFail('resetPasswordButtonLoaderAction');
    }
  } catch (e) {
    stopGeneralLoaderOnSuccessOrFail('resetPasswordButtonLoaderAction');
    displayErrors(e);
    throw Error();
  }
};
