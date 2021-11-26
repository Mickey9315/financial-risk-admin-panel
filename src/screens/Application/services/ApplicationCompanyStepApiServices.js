import ApiService from '../../../services/api-service/ApiService';
import { APPLICATION_URLS } from '../../../constants/UrlConstants';

const ApplicationCompanyStepApiServices = {
  getApplicationCompanyStepDropdownData: params =>
    ApiService.getData(APPLICATION_URLS.COMPANY.DROP_DOWN_DATA_URL, { params }),
  getApplicationCompanyDataFromDebtor: (id, params) =>
    ApiService.getData(`${APPLICATION_URLS.COMPANY.SEARCH_APPLICATION_BY_DEBTOR_DETAILS}${id}`, {
      params,
    }),
  getApplicationCompanyDataFromABNorACN: params =>
    ApiService.getData(`${APPLICATION_URLS.COMPANY.SEARCH_APPLICATION_BY_ABN_ACN_DETAILS}`, {
      params,
    }),
  searchApplicationCompanyEntityName: params =>
    ApiService.getData(`${APPLICATION_URLS.COMPANY.SEARCH_APPLICATION_ENTITY_TYPE}`, {
      params,
    }),
  deleteApplicationPersonIndividualData: personId =>
    ApiService.deleteData(`${APPLICATION_URLS.COMPANY.DELETE_APPLICATION_PERSONS}${personId}`),
    generateRandomRegistrationNumber: params => ApiService.getData(APPLICATION_URLS.COMPANY.GENERATE_RANDOM_REGISTRATION_NUMBER, {params})
};
export default ApplicationCompanyStepApiServices;
