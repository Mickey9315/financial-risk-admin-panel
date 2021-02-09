import ApiService from '../../../services/api-service/ApiService';
import { USER_MANAGEMENT_URLS } from '../../../constants/UrlConstants';

const UserManagementApiService = {
  getAllUserList: params => ApiService.getData(USER_MANAGEMENT_URLS.USER_LIST_URL, { params }),
};

export default UserManagementApiService;
