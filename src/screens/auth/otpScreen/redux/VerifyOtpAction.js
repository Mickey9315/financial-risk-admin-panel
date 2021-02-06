import AuthApiService from '../../services/AuthApiService';
import { errorNotification, successNotification } from '../../../../common/Toast';
import { SESSION_VARIABLES } from '../../../../constants/SessionStorage';

export const verifyOtp = async verificationOtp => {
  try {
    const data = { _id: SESSION_VARIABLES.USER_ID, verificationOtp };
    const response = await AuthApiService.verifyOtp(data);

    if (response.data.status === 'SUCCESS') {
      const { token } = response.data.data;
      SESSION_VARIABLES.RESET_PASSWORD_TOKEN = token;

      successNotification('OTP verified successfully.');
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
