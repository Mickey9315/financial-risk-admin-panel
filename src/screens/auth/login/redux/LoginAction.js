import AuthApiService from '../../services/AuthApiService';
import { successNotification } from '../../../../common/Toast';
import { saveAuthTokenLocalStorage } from '../../../../helpers/LocalStorageHelper';
import { getLoggedUserDetails } from '../../../../common/Header/redux/HeaderAction';
import {
  startGeneralLoaderOnRequest,
  stopGeneralLoaderOnSuccessOrFail,
} from '../../../../common/GeneralLoader/redux/GeneralLoaderAction';
import { displayErrors } from '../../../../helpers/ErrorNotifyHelper';

export const loginUser = ({ email, password }, rememberMe) => {
  return async dispatch => {
    try {
      startGeneralLoaderOnRequest('logInButtonLoaderAction');
      const data = { userId: email.toLowerCase().trim(), password: password.trim() };
      const response = await AuthApiService.loginUser(data);

      if (response?.data?.status === 'SUCCESS') {
        const { token } = response?.data?.data;

        if (rememberMe) {
          saveAuthTokenLocalStorage(token);
        } else {
          saveAuthTokenLocalStorage(token);
        }

        successNotification('Login successfully.');
        await dispatch(getLoggedUserDetails());
        stopGeneralLoaderOnSuccessOrFail('logInButtonLoaderAction');
      }
    } catch (e) {
      stopGeneralLoaderOnSuccessOrFail('logInButtonLoaderAction');
      displayErrors(e);
      throw Error();
    }
  };
};
