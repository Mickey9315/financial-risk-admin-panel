import ApiService from '../../../services/api-service/ApiService';
import { ALERTS_URLS } from '../../../constants/UrlConstants';

export const AlertsApiService = {
  getAlertsList: params => ApiService.getData(ALERTS_URLS.GET_ALERTS_LIST, { params }),
  getAlertsColumnList: params => ApiService.getData(ALERTS_URLS.GET_ALERTS_COLUMN_LIST, { params }),
  updateAlertsColumnList: data => ApiService.putData(ALERTS_URLS.UPDATE_ALERTS_COLUMN_LIST, data),

  getAlertClientList: () => ApiService.getData(ALERTS_URLS.GET_ALERT_CLIENT_LIST),
  getAlertFilterDropdownData: () => ApiService.getData(ALERTS_URLS.GET_ALERT_FILTER_DATA),
  getAlertDetails: id => ApiService.getData(`${ALERTS_URLS.GET_ALERT_DETAIL}${id}`),
  updateAlertStatus: (id, data) =>
    ApiService.putData(`${ALERTS_URLS.UPDATE_ALERT_STATUS}${id}`, data),
  downloadAlertList: params =>
    ApiService.request({
      url: `${ALERTS_URLS.DOWNLOAD_ALERT}`,
      params,
      method: 'GET',
      responseType: 'blob',
      timeout: 60000,
    }),
};
