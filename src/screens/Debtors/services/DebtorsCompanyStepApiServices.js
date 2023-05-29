import ApiService from '../../../services/api-service/ApiService';
import { DEBTORS_URLS } from '../../../constants/UrlConstants';

const DebtorsCompanyStepApiServices = {
  getDebtorsCompanyStepDropdownData: params =>
    ApiService.getData(DEBTORS_URLS.COMPANY.DROP_DOWN_DATA_URL, { params }),
  getDebtorsCompanyDataFromDebtor: (id, params) =>
    ApiService.getData(`${DEBTORS_URLS.COMPANY.SEARCH_APPLICATION_BY_DEBTOR_DETAILS}${id}`, {
      params,
    }),
  getDebtorsCompanyDataFromABNorACN: params =>
    ApiService.getData(`${DEBTORS_URLS.COMPANY.SEARCH_APPLICATION_BY_ABN_ACN_DETAILS}`, {
      params,
    }),
  searchDebtorsCompanyEntityName: params =>
    ApiService.getData(`${DEBTORS_URLS.COMPANY.SEARCH_APPLICATION_ENTITY_TYPE}`, {
      params,
    }),
  deleteDebtorsPersonIndividualData: personId =>
    ApiService.deleteData(`${DEBTORS_URLS.COMPANY.DELETE_APPLICATION_PERSONS}${personId}`),
  generateRandomRegistrationNumber: params =>
    ApiService.getData(DEBTORS_URLS.COMPANY.GENERATE_RANDOM_REGISTRATION_NUMBER, { params }),
};
export default DebtorsCompanyStepApiServices;
