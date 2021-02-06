import ApiService from '../../../services/api-service/ApiService';
import { AUTH_URLS } from '../../../constants/UrlConstants';

const AuthApiService = {
  loginUser: data => ApiService.postData(AUTH_URLS.LOGIN_URL, data),
};

export default AuthApiService;
