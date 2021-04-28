import ApiService from '../../../services/api-service/ApiService';
import { APPLICATION_URLS } from '../../../constants/UrlConstants';

const ApplicationCompanyStepApiServices = {
  getApplicationCompanyStepDropdownData: params =>
    ApiService.getData(APPLICATION_URLS.COMPANY.DROP_DOWN_DATA_URL, { params }),
  getApplicationCompanyDataFromDebtor: (id, params) =>
    ApiService.getData(`${APPLICATION_URLS.COMPANY.SEARCH_APPLICATION_BY_DEBTOR_DETAILS}${id}`, {
      params,
    }),
  getApplicationCompanyDataFromABNorACN: (id, params) =>
    ApiService.getData(`${APPLICATION_URLS.COMPANY.SEARCH_APPLICATION_BY_ABN_ACN_DETAILS}${id}`, {
      params,
    }),
  searchApplicationCompanyEntityName: (searchText, params) =>
    ApiService.getData(`${APPLICATION_URLS.COMPANY.SEARCH_APPLICATION_ENTITY_TYPE}${searchText}`, {
      params,
    }),
  deleteApplicationCompanyEntityTypeData: params =>
    ApiService.deleteData(`${APPLICATION_URLS.COMPANY.DELETE_APPLICATION_ENTITY_TYPE}`, { params }),
};
export default ApplicationCompanyStepApiServices;
