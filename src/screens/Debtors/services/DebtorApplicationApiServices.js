import ApiService from '../../../services/api-service/ApiService';
import { DEBTORS_URLS } from '../../../constants/UrlConstants';

const DebtorApplicationApiServices = {
  downloadApplicationCSVFile: id =>
    ApiService.request({
      url: `${DEBTORS_URLS.APPLICATION.DOWNLOAD_APPLICATION_CSV}${id}?listFor=debtor-application`,
      method: 'GET',
      responseType: 'blob',
      timeout: 60000,
    }),
  getApplicationListData: (id, params) =>
    ApiService.getData(`${DEBTORS_URLS.APPLICATION.APPLICATION_LIST}${id}`, { params }),
  getDebtorApplicationColumnNameList: params =>
    ApiService.getData(DEBTORS_URLS.APPLICATION.COLUMN_NAME_LIST_URL, { params }),
  updateDebtorApplicationColumnNameList: data =>
    ApiService.putData(`${DEBTORS_URLS.APPLICATION.UPDATE_COLUMN_NAME_LIST_URL}`, data),
};
export default DebtorApplicationApiServices;
