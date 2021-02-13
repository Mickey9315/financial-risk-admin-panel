import AuthApiService from '../../services/AuthApiService';
import { errorNotification, successNotification } from '../../../../common/Toast';

export const forgotPassword = async email => {
  try {
    const data = { email };
    const response = await AuthApiService.forgotPassword(data);

    if (response.data.status === 'SUCCESS') {
      successNotification('OTP has been sent successfully to your registered email address.');
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
