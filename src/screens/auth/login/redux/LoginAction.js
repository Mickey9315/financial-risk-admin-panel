import { LOGIN_REDUX_CONSTANTS } from './LoginReduxConstants';
import AuthApiService from '../../services/AuthApiService';
import { errorNotification, successNotification } from '../../../../common/Toast';
import {
  saveAuthTokenLocalStorage,
  saveTokenToSession,
} from '../../../../helpers/LocalStorageHelper';

export const loginUser = ({ email, password }, rememberMe) => {
  return async dispatch => {
    try {
      const data = { userId: email.trim(), password: password.trim() };
      const response = await AuthApiService.loginUser(data);

      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: LOGIN_REDUX_CONSTANTS.LOGIN_USER_ACTION,
          data: response.data.data,
        });

        const { token } = response.data.data;

        if (rememberMe) {
          saveAuthTokenLocalStorage(token);
        } else {
          saveTokenToSession(token);
        }

        successNotification('Login successfully.');
      }
    } catch (e) {
      if (e.response && e.response.data) {
        if (e.response.data.status === undefined) {
          errorNotification('It seems like server is down, Please try again later.');
        } else if (e.response.data.status === 'INTERNAL_SERVER_ERROR') {
          errorNotification('Internal server error');
        } else if (e.response.data.status === 'ERROR') {
          if (e.response.data.messageCode) {
            switch (e.response.data.messageCode) {
              case 'USER_NOT_FOUND':
              case 'EMAIL_NOT_FOUND':
                errorNotification('User not found');
                break;
              default:
                break;
            }
          } else {
            errorNotification('It seems like server is down, Please try again later.');
          }
        }
        throw Error();
      }
    }
  };
};
