import ApiService from '../../../services/api-service/ApiService';
import { DEBTORS_URLS } from '../../../constants/UrlConstants';

const DebtorAlertsApiServices = {
  getAlertsListData: (id, params) =>
    ApiService.getData(`${DEBTORS_URLS.ALERTS.ALERTS_LIST}${id}`, { params }),
  getDebtorAlertsDetails: id => ApiService.getData(`${DEBTORS_URLS.ALERTS.ALERTS_DETAILS}${id}`),
};
export default DebtorAlertsApiServices;
