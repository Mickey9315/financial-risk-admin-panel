import ApiService from '../../../services/api-service/ApiService';
import { AUTH_URLS } from '../../../constants/UrlConstants';
import { SESSION_VARIABLES } from '../../../constants/SessionStorage';

const AuthApiService = {
  loginUser: data => ApiService.postData(AUTH_URLS.LOGIN_URL, data),
  forgotPassword: data => ApiService.postData(AUTH_URLS.FORGOT_PASSWORD_URL, data),
  verifyOtp: data => ApiService.postData(AUTH_URLS.VERIFY_OTP_URL, data),
  resetPassword: data =>
    ApiService.postData(
      `${AUTH_URLS.RESET_PASSWORD_URL + SESSION_VARIABLES.USER_ID}/reset-password`,
      data
    ),
};

export default AuthApiService;
