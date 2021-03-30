import ApiService from '../../../services/api-service/ApiService';
import { APPLICATION_URLS } from '../../../constants/UrlConstants';

const ApplicationDocumentStepApiServices = {
  getDocumentTypeListData: params =>
    ApiService.getData(APPLICATION_URLS.DOCUMENTS.GET_DOCUMENT_TYPE_LIST_URL, { params }),
  uploadDocument: (data, config) =>
    ApiService.postData(APPLICATION_URLS.DOCUMENTS.UPLOAD_DOCUMENT_URL, data, config),
};
export default ApplicationDocumentStepApiServices;
