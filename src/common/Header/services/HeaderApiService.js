import ApiService from '../../../services/api-service/ApiService';
import { HEADER_URLS } from '../../../constants/UrlConstants';

const HeaderApiService = {
  changePassword: data => ApiService.putData(HEADER_URLS.CHANGE_PASSWORD_URL, data),
  logoutUser: () => ApiService.deleteData(HEADER_URLS.LOGOUT_URL),
};

export default HeaderApiService;
