import ApiService from '../../../services/api-service/ApiService';
import { CLAIMS_URLS } from '../../../constants/UrlConstants';

export const ClaimsApiServices = {
  getClaimsListByFilter: params => ApiService.getData(CLAIMS_URLS.CLAIMS_LIST, { params }),
  getClaimsColumnList: params => ApiService.getData(CLAIMS_URLS.CLAIMS_COLUMN_LIST, { params }),
  updateClaimsColumnList: data => ApiService.putData(CLAIMS_URLS.UPDATE_CLAIMS_COLUMN_LIST, data),

  getClaimsEntityList: () => ApiService.getData(CLAIMS_URLS.GET_CLAIMS_ENTITY_LIST),
  addClaim: data => ApiService.postData(CLAIMS_URLS.ADD_CLAIM, data),
  getClaimDetails: id => ApiService.getData(CLAIMS_URLS.GET_CLAIM_DETAILS + id),

  ClaimsDocumentServices: {
    getClaimsDocumentsList: (id, params) =>
      ApiService.getData(`${CLAIMS_URLS.DOCUMENTS.DOCUMENTS_LIST}${id}`, { params }),
    uploadClaimDocument: (data, config) =>
      ApiService.postData(CLAIMS_URLS.DOCUMENTS.DOCUMENTS_LIST, data, {
        ...config,
        timeout: 60000,
      }),
    downloadClaimDocument: id =>
      ApiService.request({
        url: `${CLAIMS_URLS.DOCUMENTS.DOWNLOAD_DOCUMENTS}${id}`,
        method: 'GET',
        responseType: 'blob',
        timeout: 60000,
      }),
  },
  getClaimsManagerList: () => ApiService.getData(CLAIMS_URLS.GET_CLAIMS_MANAGER_LIST),
};
