import ApiService from '../../../services/api-service/ApiService';
import { CLIENT_URLS } from '../../../constants/UrlConstants';

const ClientApiService = {
  getAllClientList: params => ApiService.getData(CLIENT_URLS.CLIENT_LIST_URL, { params }),
};

export default ClientApiService;
