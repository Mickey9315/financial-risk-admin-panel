/*
import ApiService from '../../../services/api-service/ApiService';
import { ORGANISATION_MODULE_URLS, INSURER_URLS } from '../../../constants/UrlConstants';

const InsurerApiService = {
  getAllInsurerList: params => ApiService.getData(INSURER_URLS.INSURER_LIST_URL, { params }),
  getInsurerColumnListName: () => ApiService.getData(INSURER_URLS.INSURER_COLUMN_NAME_LIST_URL),
  getAllOrganisationModuleList: () =>
    ApiService.getData(ORGANISATION_MODULE_URLS.GET_ORGANIZATION_MODULE_LIST_URL),
  getSelectedInsurerData: id =>
    ApiService.getData(`${INSURER_URLS.SELECTED_INSURER_DETAILS_URL}${id}`),
  getClientList: () => ApiService.getData(INSURER_URLS.INSURER_CLIENT_LIST_URL),
  addNewInsurer: data => ApiService.postData(INSURER_URLS.SELECTED_INSURER_DETAILS_URL, data),
  updateInsurer: (id, data) =>
    ApiService.putData(`${INSURER_URLS.SELECTED_INSURER_DETAILS_URL}${id}`, data),
  deleteInsurer: id => ApiService.deleteData(`${INSURER_URLS.SELECTED_INSURER_DETAILS_URL}${id}`),
  updateInsurerColumnListName: data =>
    ApiService.putData(INSURER_URLS.UPDATE_INSURER_COLUMN_NAME_LIST_URL, data),
  getAllInsurerListByFilter: params =>
    ApiService.getData(INSURER_URLS.INSURER_LIST_URL, { params }),
};

export default InsurerApiService;
*/
