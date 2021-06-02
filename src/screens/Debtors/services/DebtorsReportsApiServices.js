import ApiService from '../../../services/api-service/ApiService';
import { DEBTORS_URLS } from '../../../constants/UrlConstants';

const DebtorApplicationApiServices = {
  getDebtorsReportListData: (id, params) =>
    ApiService.getData(`${DEBTORS_URLS.REPORTS.DEBTOR_REPORTS_LIST}${id}`, { params }),
  getDebtorsReportListDataForFetch: () =>
    ApiService.getData(`${DEBTORS_URLS.REPORTS.DEBTOR_REPORTS_LIST_FOR_FETCH}`),
  fetchSelectedReportsForDebtor: data =>
    ApiService.putData(`${DEBTORS_URLS.REPORTS.FETCH_SELECTED_REPORTS_FOR_DEBTOR}`, data),
  getDebtorReportColumnNameList: () =>
    ApiService.getData(DEBTORS_URLS.REPORTS.COLUMN_NAME_LIST_URL),
  updateDebtorReportColumnNameList: data =>
    ApiService.putData(`${DEBTORS_URLS.REPORTS.UPDATE_COLUMN_NAME_LIST_URL}`, data),
};
export default DebtorApplicationApiServices;
