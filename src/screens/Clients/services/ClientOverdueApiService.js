import ApiService from '../../../services/api-service/ApiService';
import { CLIENT_URLS } from '../../../constants/UrlConstants';

export const ClientOverdueApiServices = {
  getClientOverdueList: (params, id) =>
    ApiService.getData(`${CLIENT_URLS.CLIENT_OVERDUE.GET_CLIENT_OVERDUE_LIST}${id}`, { params }),
  getClientOverdueEntityListData: () =>
    ApiService.getData(CLIENT_URLS.CLIENT_OVERDUE.GET_CLIENT_CLAIMS_ENTITY_LIST),
};
