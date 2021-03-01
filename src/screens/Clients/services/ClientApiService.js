import ApiService from '../../../services/api-service/ApiService';
import { CLIENT_URLS } from '../../../constants/UrlConstants';

const ClientApiService = {
  getAllClientList: params => ApiService.getData(CLIENT_URLS.CLIENT_LIST_URL, { params }),
  getClientById: id => ApiService.getData(CLIENT_URLS.CLIENT_BY_ID_URL + id),
  getClientColumnListName: () => ApiService.getData(CLIENT_URLS.CLIENT_COLUMN_NAME_LIST_URL),
  updateClientColumnListName: data =>
    ApiService.putData(CLIENT_URLS.UPDATE_CLIENT_COLUMN_NAME_LIST_URL, data),
  updateSelectedClientData: (id, data) =>
    ApiService.putData(CLIENT_URLS.CLIENT_BY_ID_URL + id, data),
  getClientFilter: () => ApiService.getData(CLIENT_URLS.CLIENT_FILTER_LIST_URL),
  syncClientData: id => ApiService.putData(`${CLIENT_URLS.SYNC_CLIENT_DATA_URL}${id}`),
};

export default ClientApiService;
