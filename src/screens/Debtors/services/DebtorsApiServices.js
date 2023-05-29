import ApiService from '../../../services/api-service/ApiService';
import { DEBTORS_URLS } from '../../../constants/UrlConstants';

const DebtorsApiServices = {
  getAllDebtorsList: params => ApiService.getData(DEBTORS_URLS.DEBTORS_LIST_URL, { params }),
  getDebtorsColumnNameList: params =>
    ApiService.getData(DEBTORS_URLS.DEBTORS_COLUMNS_NAME_LIST_URL, { params }),
  updateDebtorsColumnNameList: data =>
    ApiService.putData(DEBTORS_URLS.DEBTORS_COLUMNS_NAME_LIST_URL, data),
  getDebtorDetailById: id =>
    ApiService.getData(`${DEBTORS_URLS.SELECTED_DEBTOR_DETAILS_BY_ID_URL}${id}`),
  getDebtorDetail: debtorId =>
    ApiService.getData(`${DEBTORS_URLS.SELECTED_DEBTOR_DETAILS_URL}${debtorId}`),
  getDebtorDropdownDataList: () => ApiService.getData(DEBTORS_URLS.DROP_DOWN_DATA_URL),
  updateDebtorDetailById: (id, data) =>
    ApiService.putData(`${DEBTORS_URLS.SELECTED_DEBTOR_DETAILS_URL}${id}`, data),
  getDebtorFilter: () => ApiService.getData(DEBTORS_URLS.DROP_DOWN_DATA_URL),
  downloadDebtorList: params =>
    ApiService.request({
      url: `${DEBTORS_URLS.DOWNLOAD_DEBTOR}`,
      params,
      method: 'GET',
      responseType: 'blob',
      timeout: 60000,
    }),
  debtorReportsApi: {
    downloadDebtorReport: id =>
      ApiService.request({
        url: `${DEBTORS_URLS.REPORTS.DOWNLOAD_REPORTS_FOR_DEBTOR}${id}`,
        method: 'GET',
        responseType: 'blob',
        timeout: 60000,
      }),
  },
  saveDebtorStepDataToBackend: data =>
    ApiService.putData(`${DEBTORS_URLS.DEBTORS_SAVE_STEP_DATA}`, data),
};
export default DebtorsApiServices;
