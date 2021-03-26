import ApiService from '../../../services/api-service/ApiService';
import { CLIENT_URLS } from '../../../constants/UrlConstants';

const ClientApplicationApiService = {
  getApplicationListData: (id, params) =>
    ApiService.getData(`${CLIENT_URLS.APPLICATION.APPLICATION_LIST}${id}`, { params }),
  getClientApplicationColumnNameList: params =>
    ApiService.getData(CLIENT_URLS.APPLICATION.COLUMN_NAME_LIST_URL, { params }),
  updateClientApplicationColumnNameList: data =>
    ApiService.putData(`${CLIENT_URLS.APPLICATION.UPDATE_COLUMN_NAME_LIST_URL}`, data),
};
export default ClientApplicationApiService;
