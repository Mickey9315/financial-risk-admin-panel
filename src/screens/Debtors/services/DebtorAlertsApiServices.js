import ApiService from '../../../services/api-service/ApiService';
import { DEBTORS_URLS } from '../../../constants/UrlConstants';

const DebtorAlertsApiServices = {
  getAlertsListData: (id, params) =>
    ApiService.getData(`${DEBTORS_URLS.ALERTS.ALERTS_LIST}${id}`, { params }),
};
export default DebtorAlertsApiServices;
