import ApiService from '../../../services/api-service/ApiService';
import { CLAIMS_URLS } from '../../../constants/UrlConstants';

export const ClaimsApiServices = {
  getClaimsListByFilter: params => ApiService.getData(CLAIMS_URLS.CLAIMS_LIST, { params }),
  getClaimsColumnList: params => ApiService.getData(CLAIMS_URLS.CLAIMS_COLUMN_LIST, { params }),
  updateClaimsColumnList: data => ApiService.putData(CLAIMS_URLS.UPDATE_CLAIMS_COLUMN_LIST, data),

  getClaimsEntityList: () => ApiService.getData(CLAIMS_URLS.GET_CLAIMS_ENTITY_LIST),
  addClaim: data => ApiService.postData(CLAIMS_URLS.ADD_CLAIM, data),
  getClaimDetails: id => ApiService.getData(CLAIMS_URLS.GET_CLAIM_DETAILS + id),
};
