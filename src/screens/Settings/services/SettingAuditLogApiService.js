import ApiService from '../../../services/api-service/ApiService';
import { SETTING_URL } from '../../../constants/UrlConstants';

const SettingAuditLogServices = {
  getAuditLogList: params =>
    ApiService.getData(SETTING_URL.AUDIT_LOG.GET_AUDIT_LOG_LIST, { params }),
  getAuditLogColumnNameList: data =>
    ApiService.getData(SETTING_URL.AUDIT_LOG.GET_AUDIT_LOG_COLUMN_LIST_NAME, data),
  updateAuditLogColumnNameList: data =>
    ApiService.putData(SETTING_URL.AUDIT_LOG.UPDATE_AUDIT_LOG_COLUMN_NAME_LIST, data),
  getAuditUserNameList: data =>
    ApiService.getData(SETTING_URL.AUDIT_LOG.GET_AUDIT_USER_TYPE_LIST, data),
};
export default SettingAuditLogServices;
