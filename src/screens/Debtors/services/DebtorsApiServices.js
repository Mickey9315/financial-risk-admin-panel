import ApiService from '../../../services/api-service/ApiService';
import { DEBTORS_URLS } from '../../../constants/UrlConstants';

const DebtorsApiServices = {
  getAllDebtorsList: params => ApiService.getData(DEBTORS_URLS.DEBTORS_LIST_URL, { params }),
  getDebtorsColumnNameList: params =>
    ApiService.getData(DEBTORS_URLS.DEBTORS_COLUMNS_NAME_LIST_URL, { params }),
  updateDebtorsColumnNameList: data =>
    ApiService.putData(DEBTORS_URLS.DEBTORS_COLUMNS_NAME_LIST_URL, data),
  getDebtorDetailById: id => ApiService.getData(`${DEBTORS_URLS.SELECTED_DEBTOR_DETAILS_URL}${id}`),
  getDebtorDropdownDataList: () => ApiService.getData(DEBTORS_URLS.DROP_DOWN_DATA_URL),
  updateDebtorDetailById: (id, data) =>
    ApiService.putData(`${DEBTORS_URLS.SELECTED_DEBTOR_DETAILS_URL}${id}`, data),
  downloadDebtorList: params =>
    ApiService.request({
      url: `${DEBTORS_URLS.DOWNLOAD_DEBTOR}`,
      params,
      method: 'GET',
      responseType: 'blob',
    }),
};
export default DebtorsApiServices;
