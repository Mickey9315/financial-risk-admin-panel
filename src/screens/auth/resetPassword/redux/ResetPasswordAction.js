import AuthApiService from '../../services/AuthApiService';
import { errorNotification, successNotification } from '../../../../common/Toast';
import { SESSION_VARIABLES } from '../../../../constants/SessionStorage';

export const resetPassword = async password => {
  try {
    const data = { token: SESSION_VARIABLES.RESET_PASSWORD_TOKEN, password };
    const response = await AuthApiService.resetPassword(data);

    if (response.data.status === 'SUCCESS') {
      delete SESSION_VARIABLES.RESET_PASSWORD_TOKEN;

      successNotification('Password changed successfully.');
    }
  } catch (e) {
    if (e.response.data.status === undefined) {
      errorNotification('It seems like server is down, Please try again later.');
    } else if (e.response.data.status === 'INTERNAL_SERVER_ERROR') {
      errorNotification('Internal server error');
    }
    throw Error();
  }
};
