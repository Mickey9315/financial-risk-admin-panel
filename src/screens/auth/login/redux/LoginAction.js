import AuthApiService from '../../services/AuthApiService';
import { successNotification } from '../../../../common/Toast';
import {
  saveAuthTokenLocalStorage,
  saveTokenToSession,
} from '../../../../helpers/LocalStorageHelper';
import { getLoggedUserDetails } from '../../../../common/Header/redux/HeaderAction';
import {
  startLoaderButtonOnRequest,
  stopLoaderButtonOnSuccessOrFail,
} from '../../../../common/LoaderButton/redux/LoaderButtonAction';
import { displayErrors } from '../../../../helpers/ErrorNotifyHelper';

export const loginUser = ({ email, password }, rememberMe) => {
  return async dispatch => {
    try {
      startLoaderButtonOnRequest('logInButtonLoaderAction');
      const data = { userId: email.toLowerCase().trim(), password: password.trim() };
      const response = await AuthApiService.loginUser(data);

      if (response.data.status === 'SUCCESS') {
        const { token } = response.data.data;

        if (rememberMe) {
          saveAuthTokenLocalStorage(token);
        } else {
          saveTokenToSession(token);
        }

        successNotification('Login successfully.');
        await dispatch(getLoggedUserDetails());
        stopLoaderButtonOnSuccessOrFail('logInButtonLoaderAction');
      }
    } catch (e) {
      stopLoaderButtonOnSuccessOrFail('logInButtonLoaderAction');
      displayErrors(e);
      throw Error();
    }
  };
};
