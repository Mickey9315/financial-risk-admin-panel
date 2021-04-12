import ApiService from '../../../services/api-service/ApiService';
import { DEBTORS_URLS } from '../../../constants/UrlConstants';

const DebtorStakeHolderApiServices = {
  getStakeHolderListData: (id, params) =>
    ApiService.getData(`${DEBTORS_URLS.STAKE_HOLDER.STAKE_HOLDER_LIST}${id}`, { params }),
  getDebtorStakeHolderColumnNameList: params =>
    ApiService.getData(DEBTORS_URLS.STAKE_HOLDER.COLUMN_NAME_LIST_URL, { params }),
  updateDebtorStakeHolderColumnNameList: data =>
    ApiService.putData(`${DEBTORS_URLS.STAKE_HOLDER.UPDATE_COLUMN_NAME_LIST_URL}`, data),
};
export default DebtorStakeHolderApiServices;
