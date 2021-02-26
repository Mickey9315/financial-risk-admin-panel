import ApiService from '../../../services/api-service/ApiService';
import { CLIENT_URLS } from '../../../constants/UrlConstants';

const ClientPoliciesApiService = {
  getClientPoliciesList: (id, params) =>
    ApiService.getData(`${CLIENT_URLS.POLICIES.POLICIES_LIST}${id}`, { params }),
  getClientPoliciesColumnListName: () =>
    ApiService.getData(`${CLIENT_URLS.POLICIES.COLUMN_NAME_LIST_URL}?columnFor=client-policy`),
  updateClientPoliciesColumnListName: data =>
    ApiService.putData(CLIENT_URLS.POLICIES.COLUMN_NAME_LIST_URL, data),
  syncClientContactData: id =>
    ApiService.putData(`${CLIENT_URLS.POLICIES.SYNC_CLIENT_POLICIES_DATA_URL}${id}`),
};

export default ClientPoliciesApiService;
