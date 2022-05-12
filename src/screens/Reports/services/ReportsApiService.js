import ApiService from '../../../services/api-service/ApiService';
import { REPORTS_URLS } from '../../../constants/UrlConstants';

export const ReportsApiService = {
  getReportsList: params => ApiService.getData(REPORTS_URLS.GET_REPORTS_LIST, { params }),
  getReportsColumnList: params =>
    ApiService.getData(REPORTS_URLS.GET_REPORTS_COLUMN_LIST, { params }),
  updateReportsColumnList: data =>
    ApiService.putData(REPORTS_URLS.UPDATE_REPORTS_COLUMN_LIST, data),

  getReportClientList: () => ApiService.getData(REPORTS_URLS.GET_REPORT_CLIENT_LIST),
  getAlertFilterDropdownData: () => ApiService.getData(REPORTS_URLS.GET_ALERT_FILTER_DATA),
  downloadReportList: params =>
    ApiService.request({
      url: `${REPORTS_URLS.DOWNLOAD_REPORT}`,
      params,
      method: 'GET',
      responseType: 'blob',
      timeout: 60000,
    }),
};
