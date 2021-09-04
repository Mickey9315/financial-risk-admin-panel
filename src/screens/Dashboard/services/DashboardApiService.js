import ApiService from '../../../services/api-service/ApiService';
import { DASHBOARD_URLS } from '../../../constants/UrlConstants';

export const DashboardApiService = {
  getDashboardUserList: () => ApiService.getData(DASHBOARD_URLS.DASHBOARD_USER_LIST),
  getDashboardDetails: params => ApiService.getData(DASHBOARD_URLS.DASHBOARD_DETAILS, { params }),
};
