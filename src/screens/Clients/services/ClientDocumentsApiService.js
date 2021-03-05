import ApiService from '../../../services/api-service/ApiService';
import { CLIENT_URLS } from '../../../constants/UrlConstants';

const ClientDocumentsApiService = {
  getClientDocumentsList: (id, params) =>
    ApiService.getData(`${CLIENT_URLS.DOCUMENTS.DOCUMENTS_LIST}${id}`, { params }),
  getClientDocumentsColumnNamesList: () =>
    ApiService.getData(`${CLIENT_URLS.DOCUMENTS.COLUMN_NAME_LIST_URL}?columnFor=client-document`),
  updateClientDocumentColumnListName: data =>
    ApiService.putData(`${CLIENT_URLS.DOCUMENTS.COLUMN_NAME_LIST_URL}`, data),
};
export default ClientDocumentsApiService;
