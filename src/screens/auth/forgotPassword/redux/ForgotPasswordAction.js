import AuthApiService from '../../services/AuthApiService';
import { errorNotification, successNotification } from '../../../../common/Toast';
import { SESSION_VARIABLES } from '../../../../constants/SessionStorage';

export const forgotPassword = async email => {
  try {
    const data = { email };
    const response = await AuthApiService.forgotPassword(data);

    if (response.data.status === 'SUCCESS') {
      const { id } = response.data.data;
      SESSION_VARIABLES.USER_ID = id;

      successNotification('OTP has been sent successfully to your registered email address.');
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
