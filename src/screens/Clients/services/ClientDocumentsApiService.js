import ApiService from '../../../services/api-service/ApiService';
import { CLIENT_URLS } from '../../../constants/UrlConstants';

const ClientDocumentsApiService = {
  getClientDocumentsList: (id, params) =>
    ApiService.getData(`${CLIENT_URLS.DOCUMENTS.DOCUMENTS_LIST}${id}`, { params }),
  getClientDocumentsColumnNamesList: params =>
    ApiService.getData(`${CLIENT_URLS.DOCUMENTS.COLUMN_NAME_LIST_URL}`, { params }),
  updateClientDocumentColumnListName: data =>
    ApiService.putData(`${CLIENT_URLS.DOCUMENTS.COLUMN_NAME_LIST_URL}`, data),
  getDocumentTypeList: params =>
    ApiService.getData(`${CLIENT_URLS.DOCUMENTS.GET_DOCUMENT_TYPE_URL}`, { params }),
};
export default ClientDocumentsApiService;
