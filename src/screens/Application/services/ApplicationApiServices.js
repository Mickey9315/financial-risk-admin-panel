import ApiService from '../../../services/api-service/ApiService';
import { APPLICATION_URLS } from '../../../constants/UrlConstants';

const ApplicationApiServices = {
  getApplicationListByFilter: params =>
    ApiService.getData(APPLICATION_URLS.APPLICATION_LIST_URL, { params }),
  getApplicationColumnNameList: () =>
    ApiService.getData(APPLICATION_URLS.APPLICATION_COLUMN_NAME_LIST_URL),
  updateApplicationColumnNameList: data =>
    ApiService.putData(APPLICATION_URLS.APPLICATION_COLUMN_NAME_LIST_UPDATE_URL, data),
  getApplicationFilter: () => ApiService.getData(APPLICATION_URLS.APPLICATION_FILTER_LIST_URL),
};
export default ApplicationApiServices;
