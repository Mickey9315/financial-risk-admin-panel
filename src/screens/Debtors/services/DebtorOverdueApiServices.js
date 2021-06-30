import ApiService from '../../../services/api-service/ApiService';
import { DEBTORS_URLS } from '../../../constants/UrlConstants';

export const DebtorOverdueApiServices = {
  getDebtorOverdueList: (params, id) =>
    ApiService.getData(`${DEBTORS_URLS.DEBTOR_OVERDUE.GET_DEBTOR_OVERDUE_LIST}${id}`, { params }),
  getDebtorOverdueEntityListData: () =>
    ApiService.getData(DEBTORS_URLS.DEBTOR_OVERDUE.GET_DEBTOR_OVERDUE_ENTITY_LIST),
};
