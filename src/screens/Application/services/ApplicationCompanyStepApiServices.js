import ApiService from '../../../services/api-service/ApiService';
import { APPLICATION_URLS } from '../../../constants/UrlConstants';

const ApplicationCompanyStepApiServices = {
  getApplicationCompanyStepDropdownData: params =>
    ApiService.getData(APPLICATION_URLS.COMPANY.DROP_DOWN_DATA_URL, { params }),
  getApplicationCompanyDataFromDebtor: id =>
    ApiService.getData(`${APPLICATION_URLS.COMPANY.GET_DEBTOR_DETAILS}${id}`),
};
export default ApplicationCompanyStepApiServices;
