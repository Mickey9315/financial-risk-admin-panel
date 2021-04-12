import ApiService from '../../../services/api-service/ApiService';
import { DEBTORS_URLS } from '../../../constants/UrlConstants';

const DebtorCreditLimitApiServices = {
  getDebtorCreditLimitList: (id, params) =>
    ApiService.getData(`${DEBTORS_URLS.CREDIT_LIMIT.CREDIT_LIMIT_LIST}${id}`, { params }),
  getDebtorCreditLimitColumnNameList: params =>
    ApiService.getData(DEBTORS_URLS.CREDIT_LIMIT.COLUMN_NAME_LIST_URL, { params }),
  updateDebtorCreditLimitColumnNameList: data =>
    ApiService.putData(`${DEBTORS_URLS.CREDIT_LIMIT.UPDATE_COLUMN_NAME_LIST_URL}`, data),
};
export default DebtorCreditLimitApiServices;
