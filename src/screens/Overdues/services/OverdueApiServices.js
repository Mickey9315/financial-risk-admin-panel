import ApiService from '../../../services/api-service/ApiService';
import { OVERDUE_URLS } from '../../../constants/UrlConstants';

export const OverdueApiServices = {
  getOverdueList: params => ApiService.getData(OVERDUE_URLS.GET_OVERDUE_LIST, { params }),
  getOverdueListByDate: params =>
    ApiService.getData(OVERDUE_URLS.GET_OVERDUE_LIST_BY_DATE, { params }),
  getEntityListData: () => ApiService.getData(OVERDUE_URLS.GET_ENTITY_LIST),
  changeOverdueStatus: (id, data) =>
    ApiService.putData(`${OVERDUE_URLS.CHANGE_OVERDUE_STATUS}${id}`, data),
  saveOverdueList: data => ApiService.putData(OVERDUE_URLS.SAVE_OVERDUE_LIST, data),
  downloadOverdues: params =>
    ApiService.request({
      url: `${OVERDUE_URLS.DOWNLOAD_OVERDUES}`,
      params,
      method: 'GET',
      responseType: 'blob',
      timeout: 60000,
    }),
};
