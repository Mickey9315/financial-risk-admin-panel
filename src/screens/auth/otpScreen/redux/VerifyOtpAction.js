import AuthApiService from '../../services/AuthApiService';
import { errorNotification, successNotification } from '../../../../common/Toast';
import { SESSION_VARIABLES } from '../../../../constants/SessionStorage';

export const verifyOtp = async verificationOtp => {
  try {
    const data = { email: SESSION_VARIABLES.USER_EMAIL, verificationOtp };
    const response = await AuthApiService.verifyOtp(data);

    if (response.data.status === 'SUCCESS') {
      const { token } = response.data.data;
      SESSION_VARIABLES.RESET_PASSWORD_TOKEN = token;

      successNotification('OTP verified successfully.');
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
            case 'OTP_EXPIRED':
              errorNotification('OTP expired please try again');
              break;
            case 'REQUIRE_FIELD_MISSING':
              errorNotification('Please enter user id');
              break;
            case 'WRONG_OTP':
              errorNotification('Please enter correct OTP');
              break;
            default:
              break;
          }
        } else {
          errorNotification(e);
        }
      }
      throw Error();
    }
  }
};
