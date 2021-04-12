import ApiService from '../../../services/api-service/ApiService';
import { SETTING_URL } from '../../../constants/UrlConstants';

const SettingDocumentTypeApiServices = {
  getDocumentListData: params =>
    ApiService.getData(SETTING_URL.DOCUMENT_TYPE.DOCUMENT_TYPE_LIST, { params }),
  addNewDocumentType: data =>
    ApiService.postData(SETTING_URL.DOCUMENT_TYPE.ADD_NEW_DOCUMENT_TYPE_LIST, data),
  getDocumentTypeDetailsById: id =>
    ApiService.getData(`${SETTING_URL.DOCUMENT_TYPE.GET_DOCTYPE_DETAIL}${id}`),
  editDocumentTypeById: (id, data) =>
    ApiService.putData(`${SETTING_URL.DOCUMENT_TYPE.UPDATE_DOCUMENT_BY_ID}${id}`, data),
  deleteDocumentType: id =>
    ApiService.deleteData(`${SETTING_URL.DOCUMENT_TYPE.DELETE_DOCUMENT_BY_ID}${id}`),
};
export default SettingDocumentTypeApiServices;
