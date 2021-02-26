import ApiService from '../../../services/api-service/ApiService';
import { CLIENT_URLS } from '../../../constants/UrlConstants';

const ClientContactApiService = {
  getClientContactList: (id, params) =>
    ApiService.getData(`${CLIENT_URLS.CONTACT.CONTACT_LIST}${id}`, { params }),
  getClientContactColumnListName: () =>
    ApiService.getData(CLIENT_URLS.CONTACT.COLUMN_NAME_LIST_URL),
  updateClientContactColumnListName: data =>
    ApiService.putData(CLIENT_URLS.CONTACT.COLUMN_NAME_LIST_URL, data),
  syncClientContactData: id =>
    ApiService.putData(`${CLIENT_URLS.CONTACT.SYNC_CLIENT_CONTACT_DATA_URL}${id}`),
};

export default ClientContactApiService;
