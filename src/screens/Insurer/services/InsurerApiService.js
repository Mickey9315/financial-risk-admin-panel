import ApiService from '../../../services/api-service/ApiService';
import { INSURER_URLS } from '../../../constants/UrlConstants';

const InsurerApiService = {
  getInsurerColumnListName: () => ApiService.getData(INSURER_URLS.INSURER_COLUMN_NAME_LIST_URL),
  getSelectedInsurerData: id =>
    ApiService.getData(`${INSURER_URLS.SELECTED_INSURER_DETAILS_URL}${id}`),
  updateInsurerColumnListName: data =>
    ApiService.putData(INSURER_URLS.UPDATE_INSURER_COLUMN_NAME_LIST_URL, data),
  getAllInsurerListData: params => ApiService.getData(INSURER_URLS.INSURER_LIST_URL, { params }),
  getListFromCRM: data =>
    ApiService.getData(`${INSURER_URLS.GET_DATA_FROM_CRM_URL}?searchKeyword=${data}`),
  addInsurerListFromCrm: data => ApiService.postData(INSURER_URLS.ADD_DATA_FROM_CRM_URL, data),
  syncInsurerDataWithCrm: id => ApiService.putData(`${INSURER_URLS.SYNC_DATA_WITH_CRM_URL}${id}`),
};

export default InsurerApiService;
