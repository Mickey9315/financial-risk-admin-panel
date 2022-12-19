import ApiService from '../../../services/api-service/ApiService';
import { CLIENT_URLS } from '../../../constants/UrlConstants';

const ClientApplicationApiService = {
  downloadApplicationCSVFile: id =>
    ApiService.request({
      url: `${CLIENT_URLS.APPLICATION.DOWNLOAD_APPLICATION_CSV}${id}?listFor=client-application`,
      method: 'GET',
      responseType: 'blob',
      timeout: 60000,
    }),
  getApplicationListData: (id, params) =>
    ApiService.getData(`${CLIENT_URLS.APPLICATION.APPLICATION_LIST}${id}`, { params }),
  getClientApplicationColumnNameList: params =>
    ApiService.getData(CLIENT_URLS.APPLICATION.COLUMN_NAME_LIST_URL, { params }),
  updateClientApplicationColumnNameList: data =>
    ApiService.putData(`${CLIENT_URLS.APPLICATION.UPDATE_COLUMN_NAME_LIST_URL}`, data),
};
export default ClientApplicationApiService;
