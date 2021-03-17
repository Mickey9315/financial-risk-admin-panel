import ApiService from '../../../services/api-service/ApiService';
import { INSURER_URLS } from '../../../constants/UrlConstants';

const InsurerContactApiServices = {
  getInsurerContactList: (id, params) =>
    ApiService.getData(`${INSURER_URLS.CONTACT.CONTACT_LIST}${id}`, { params }),
  getInsurerContactColumnListName: () =>
    ApiService.getData(`${INSURER_URLS.CONTACT.COLUMN_NAME_LIST_URL}`),
  updateInsurerContactColumnNameList: data =>
    ApiService.putData(`${INSURER_URLS.CONTACT.UPDATE_COLUMN_NAME_LIST_URL}`, data),
  syncInsurerContactList: id =>
    ApiService.putData(`${INSURER_URLS.CONTACT.SYNC_CONTACT_LIST_URL}${id}`),
};
export default InsurerContactApiServices;
