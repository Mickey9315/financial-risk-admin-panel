import ApiService from '../../../services/api-service/ApiService';
import { DEBTORS_URLS } from '../../../constants/UrlConstants';

const DebtorCreditLimitApiServices = {
  getDebtorCreditLimitList: (id, params) =>
    ApiService.getData(`${DEBTORS_URLS.CREDIT_LIMIT.CREDIT_LIMIT_LIST}${id}`, { params }),
  getDebtorCreditLimitColumnNameList: params =>
    ApiService.getData(DEBTORS_URLS.CREDIT_LIMIT.COLUMN_NAME_LIST_URL, { params }),
  updateDebtorCreditLimitColumnNameList: data =>
    ApiService.putData(`${DEBTORS_URLS.CREDIT_LIMIT.UPDATE_COLUMN_NAME_LIST_URL}`, data),
  modifyDebtorCreditLimitData: (id, data) =>
    ApiService.putData(`${DEBTORS_URLS.CREDIT_LIMIT.CREDIT_LIMIT_ACTIONS}${id}`, data),
  surrenderDebtorCreditLimitData: (id, data) =>
    ApiService.putData(`${DEBTORS_URLS.CREDIT_LIMIT.CREDIT_LIMIT_ACTIONS}${id}`, data),
  downloadCreditLimitCSVFile: id =>
    ApiService.request({
      url: `${DEBTORS_URLS.CREDIT_LIMIT.DOWNLOAD_DEBTOR_CREDIT_LIMIT_CSV}${id}`,
      method: 'GET',
      responseType: 'blob',
      timeout: 60000,
    }),
  downloadCreditLimitDecisionLetter: id =>
    ApiService.request({
      url: `${DEBTORS_URLS.CREDIT_LIMIT.DOWNLOAD_DEBTOR_CREDIT_LIMIT_DECISION_LETTER}${id}`,
      method: 'GET',
      responseType: 'blob',
    }),
};
export default DebtorCreditLimitApiServices;
