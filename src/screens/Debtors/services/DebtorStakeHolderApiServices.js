import ApiService from '../../../services/api-service/ApiService';
import { DEBTORS_URLS } from '../../../constants/UrlConstants';

const DebtorStakeHolderApiServices = {
  getStakeHolderListData: (id, params) =>
    ApiService.getData(`${DEBTORS_URLS.STAKE_HOLDER.STAKE_HOLDER_LIST}${id}`, { params }),
  getDebtorStakeHolderColumnNameList: params =>
    ApiService.getData(DEBTORS_URLS.STAKE_HOLDER.COLUMN_NAME_LIST_URL, { params }),
  updateDebtorStakeHolderColumnNameList: data =>
    ApiService.putData(`${DEBTORS_URLS.STAKE_HOLDER.UPDATE_COLUMN_NAME_LIST_URL}`, data),
  StakeHolderCRUD: {
    getStakeHolderDetails: id =>
      ApiService.getData(
        `${DEBTORS_URLS.STAKE_HOLDER.STAKE_HOLDER_CRUD.GET_STAKE_HOLDER_DETAIL}${id}`
      ),
    getStakeHolderDropdownData: params =>
      ApiService.getData(DEBTORS_URLS.STAKE_HOLDER.STAKE_HOLDER_CRUD.DROP_DOWN_DATA_URL, {
        params,
      }),
    getStakeHolderCompanyDataFromABNorACN: id =>
      ApiService.getData(
        `${DEBTORS_URLS.STAKE_HOLDER.STAKE_HOLDER_CRUD.SEARCH_APPLICATION_BY_ABN_ACN_DETAILS}${id}`
      ),
    searchStakeHolderCompanyEntityName: params =>
      ApiService.getData(
        `${DEBTORS_URLS.STAKE_HOLDER.STAKE_HOLDER_CRUD.SEARCH_APPLICATION_ENTITY_TYPE}`,
        { params }
      ),
    addNewStakeHolder: (debtorId, data) =>
      ApiService.postData(
        `${DEBTORS_URLS.STAKE_HOLDER.STAKE_HOLDER_CRUD.SAVE_NEW_STAKE_HOLDER}${debtorId}`,
        data
      ),
    updateStakeHolder: (debtorId, stakeHolderId, data) =>
      ApiService.putData(
        `${DEBTORS_URLS.STAKE_HOLDER.STAKE_HOLDER_CRUD.SAVE_NEW_STAKE_HOLDER}${debtorId}/${stakeHolderId}`,
        data
      ),
    deleteStakeHolder: stakeHolderId =>
      ApiService.deleteData(
        `${DEBTORS_URLS.STAKE_HOLDER.STAKE_HOLDER_CRUD.DELETE_STAKE_HOLDER}${stakeHolderId}`
      ),
  },
};
export default DebtorStakeHolderApiServices;
