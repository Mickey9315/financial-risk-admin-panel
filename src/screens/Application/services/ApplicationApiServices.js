import ApiService from '../../../services/api-service/ApiService';
import { APPLICATION_URLS } from '../../../constants/UrlConstants';

const ApplicationApiServices = {
  getApplications: params => ApiService.getData(APPLICATION_URLS.APPLICATION_LIST_URL, { params }),
  getApplicationListByFilter: params =>
    ApiService.getData(APPLICATION_URLS.APPLICATION_LIST_URL, { params }),
};
export default ApplicationApiServices;
