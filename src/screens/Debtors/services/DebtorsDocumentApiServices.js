import ApiService from '../../../services/api-service/ApiService';
import { DEBTORS_URLS } from '../../../constants/UrlConstants';

const ClientDocumentsApiService = {
  getDebtorDocumentsList: (id, params) =>
    ApiService.getData(`${DEBTORS_URLS.DOCUMENTS.DOCUMENTS_LIST}${id}`, { params }),
  getDebtorDocumentsColumnNamesList: params =>
    ApiService.getData(`${DEBTORS_URLS.DOCUMENTS.COLUMN_NAME_LIST_URL}`, { params }),
  updateDebtorDocumentColumnListName: data =>
    ApiService.putData(`${DEBTORS_URLS.DOCUMENTS.COLUMN_NAME_LIST_URL}`, data),
  getDocumentTypeList: params =>
    ApiService.getData(`${DEBTORS_URLS.DOCUMENTS.GET_DOCUMENT_TYPE_URL}`, { params }),
  uploadDocument: (data, config) =>
    ApiService.postData(DEBTORS_URLS.DOCUMENTS.UPLOAD_DOCUMENT_URL, data, {
      ...config,
      timeout: 60000,
    }),
  downloadDocuments: params =>
    ApiService.request({
      url: `${DEBTORS_URLS.DOCUMENTS.DOWNLOAD_DOCUMENTS_URL}`,
      params,
      method: 'GET',
      responseType: 'blob',
      timeout: 60000,
    }),
  deleteDebtorDocument: id =>
    ApiService.deleteData(`${DEBTORS_URLS.DOCUMENTS.DOCUMENTS_LIST}${id}`),
};
export default ClientDocumentsApiService;

// export const DebtorsDocumentApiServices = {
//   getDebtorDocumentsList: (id, params) =>
//     ApiService.getData(`${DEBTORS_URLS.DOCUMENTS.DOCUMENTS_LIST}${id}`, { params }),
//   getDebtorDocumentsColumnNamesList: params =>
//     ApiService.getData(`${DEBTORS_URLS.DOCUMENTS.COLUMN_NAME_LIST_URL}`, { params }),
//   updateDebtorDocumentColumnListName: data =>
//     ApiService.putData(`${DEBTORS_URLS.DOCUMENTS.COLUMN_NAME_LIST_URL}`, data),
//   getDocumentTypeList: params =>
//     ApiService.getData(`${DEBTORS_URLS.DOCUMENTS.GET_DOCUMENT_TYPE_URL}`, { params }),
//   uploadDocument: (data, config) =>
//     ApiService.postData(DEBTORS_URLS.DOCUMENTS.UPLOAD_DOCUMENT_URL, data, {...config, timeout: 60000}),
//   downloadDocuments: params =>
//     ApiService.request({
//       url: `${DEBTORS_URLS.DOCUMENTS.DOWNLOAD_DOCUMENTS_URL}`,
//       params,
//       method: 'GET',
//       responseType: 'blob',
//       timeout: 60000
//     }),
//   deleteDebtorDocument: id =>
//     ApiService.deleteData(`${DEBTORS_URLS.DOCUMENTS.DOCUMENTS_LIST}${id}`),
// };

export const DebtorsDocumentApiServices = {
  getDebtorDocumentsList: (id, params) =>
    ApiService.getData(`${DEBTORS_URLS.DOCUMENTS.DOCUMENTS_LIST}${id}`, { params }),
  getDocumentTypeListData: params =>
    ApiService.getData(DEBTORS_URLS.DOCUMENTS.GET_DOCUMENT_TYPE_URL, { params }),
  uploadDocument: (data, config, params) =>
    ApiService.request({
      url: `${DEBTORS_URLS.DOCUMENTS.UPLOAD_DOCUMENT_URL}`,
      data,
      params,
      config,
      method: 'POST',
      timeout: 60000,
    }),
  downloadDocuments: params =>
    ApiService.request({
      url: `${DEBTORS_URLS.DOCUMENTS.DOWNLOAD_DOCUMENTS_URL}`,
      params,
      method: 'GET',
      responseType: 'blob',
      timeout: 60000,
    }),
  deleteDebtorDocument: id =>
    ApiService.deleteData(`${DEBTORS_URLS.DOCUMENTS.DOCUMENTS_LIST}${id}`),
  getDebtorDocumentsColumnNamesList: params =>
    ApiService.getData(`${DEBTORS_URLS.DOCUMENTS.COLUMN_NAME_LIST_URL}`, { params }),
  updateDebtorDocumentColumnListName: data =>
    ApiService.putData(`${DEBTORS_URLS.DOCUMENTS.COLUMN_NAME_LIST_URL}`, data),
  getDocumentTypeList: params =>
    ApiService.getData(`${DEBTORS_URLS.DOCUMENTS.GET_DOCUMENT_TYPE_URL}`, { params }),
};
