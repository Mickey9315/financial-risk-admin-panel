import ApiService from '../../../services/api-service/ApiService';
import { SETTING_URL } from '../../../constants/UrlConstants';

const SettingAuditLogServices = {
  getAuditLogList: params =>
    ApiService.getData(SETTING_URL.AUDIT_LOG.GET_AUDIT_LOG_LIST, { params }),
};
export default SettingAuditLogServices;
