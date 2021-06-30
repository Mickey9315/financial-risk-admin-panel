import ApiService from '../../../services/api-service/ApiService';
import { CLIENT_URLS } from '../../../constants/UrlConstants';

export const ClientClaimsApiServices = {
  getClientClaimsListByFilter: params =>
    ApiService.getData(CLIENT_URLS.CLIENT_CLAIMS.CLIENT_CLAIMS_LIST, { params }),
  getClientClaimsColumnList: params =>
    ApiService.getData(CLIENT_URLS.CLIENT_CLAIMS.CLIENT_CLAIMS_COLUMN_LIST, { params }),
  updateClientClaimsColumnList: data =>
    ApiService.putData(CLIENT_URLS.CLIENT_CLAIMS.UPDATE_CLIENT_CLAIMS_COLUMN_LIST, data),
};
