import { LOGIN_REDUX_CONSTANTS } from './LoginReduxConstants';
import AuthApiService from '../../services/AuthApiService';
import { errorNotification } from '../../../../common/Toast';

export const loginUser = (email, password) => {
  return async dispatch => {
    try {
      const data = { userId: email, password };
      const response = await AuthApiService.loginUser(data);

      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: LOGIN_REDUX_CONSTANTS.LOGIN_USER_ACTION,
          data: response.data.data,
        });
      }
    } catch (e) {
      if (e.response.data.status === undefined) {
        errorNotification('It seems like server is down, Please try again later.');
      } else if (e.response.data.status === 'INTERNAL_SERVER_ERROR') {
        errorNotification('Internal server error');
      }
    }
  };
};
