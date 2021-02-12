import ApiService from '../../../services/api-service/ApiService';
import { USER_MANAGEMENT_URLS } from '../../../constants/UrlConstants';

const UserManagementApiService = {
  getAllUserList: params => ApiService.getData(USER_MANAGEMENT_URLS.USER_LIST_URL, { params }),
  getUserColumnListName: () => ApiService.getData(USER_MANAGEMENT_URLS.USER_COLUMN_NAME_LIST_URL),
  getSelectedUserData: id =>
    ApiService.getData(`${USER_MANAGEMENT_URLS.SELECTED_USER_DETAILS_URL}${id}`),
  updateUserColumnListName: data =>
    ApiService.putData(USER_MANAGEMENT_URLS.UPDATE_USER_COLUMN_NAME_LIST_URL, data),
  getAllUserListByFilter: params =>
    ApiService.getData(USER_MANAGEMENT_URLS.USER_LIST_BY_FILTER_URL, { params }),
};

export default UserManagementApiService;
