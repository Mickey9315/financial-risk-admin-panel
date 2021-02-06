import AuthApiService from '../../services/AuthApiService';
import { errorNotification } from '../../../../common/Toast';
import { LOGIN_REDUX_CONSTANTS } from './LoginReduxConstants';

export const loginUser = (email, password) => {
  return dispatch => {
    const data = {
      email,
      password,
    };

    AuthApiService.loginUser(data)
      .then(response => {
        if (response.data.status === 'SUCCESS') {
          dispatch({
            type: LOGIN_REDUX_CONSTANTS.LOGIN_USER_ACTION,
            data: response.data.data,
          });
        }
      })
      .catch(e => {
        if (e.response.data.status === undefined) {
          errorNotification('It seems like server is down, Please try again later.');
        } else if (e.response.data.status === 'INTERNAL_SERVER_ERROR') {
          errorNotification('Internal server error');
        }
      });
  };
};
