import ApiService from '../../../services/api-service/ApiService';
import { CLIENT_URLS } from '../../../constants/UrlConstants';

const ClientApiService = {
  getAllClientList: params => ApiService.getData(CLIENT_URLS.CLIENT_LIST_URL, { params }),
  getClientById: id => ApiService.getData(CLIENT_URLS.CLIENT_BY_ID_URL + id),
};

export default ClientApiService;
