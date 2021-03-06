import ApiService from '../../../services/api-service/ApiService';
import { HEADER_URLS } from '../../../constants/UrlConstants';

const HeaderApiService = {
  loggedUserDetails: () => ApiService.getData(HEADER_URLS.LOGGED_USER_DETAILS_URL),
  updateUserProfile: data => ApiService.putData(HEADER_URLS.LOGGED_USER_DETAILS_URL, data),
  uploadUserProfilePicture: (data, config) =>
    ApiService.postData(HEADER_URLS.UPLOAD_PROFILE_PICTURE, data, config),
  changePassword: data => ApiService.putData(HEADER_URLS.CHANGE_PASSWORD_URL, data),
  logoutUser: () => ApiService.deleteData(HEADER_URLS.LOGOUT_URL),
};

export default HeaderApiService;
