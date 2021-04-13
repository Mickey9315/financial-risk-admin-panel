import ApiService from '../../../services/api-service/ApiService';
import { SETTING_URL } from '../../../constants/UrlConstants';

const SettingOrganizationDetailsApiServices = {
  getOrganizationDetails: data =>
    ApiService.getData(SETTING_URL.ORGANIZATION_DETAILS.GET_ORGANIZATION_DETAILS, data),
};
export default SettingOrganizationDetailsApiServices;
