import SettingDocumentTypeApiServices from '../services/SettingDocumentTypeApiServices';
import { SETTING_REDUX_CONSTANTS } from './SettingReduxConstants';
import { errorNotification, successNotification } from '../../../common/Toast';
import SettingOrganizationDetailsApiService from '../services/SettingOrganizationDetailsApiService';
import SettingApiIntegrationService from '../services/SettingApiIntegrationService';
import SettingAuditLogApiService from '../services/SettingAuditLogApiService';
import { displayErrors } from '../../../helpers/ErrorNotifyHelper';
import {
  startGeneralLoaderOnRequest,
  stopGeneralLoaderOnSuccessOrFail,
} from '../../../common/GeneralLoader/redux/GeneralLoaderAction';
import { store } from '../../../redux/store';

export const fetchDocRequest = () => ({
  type: SETTING_REDUX_CONSTANTS.DOCUMENT_TYPE.FETCH_DOCUMENT_TYPE_LIST_REQUEST,
});

export const fetchDocSuccess = data => ({
  type: SETTING_REDUX_CONSTANTS.DOCUMENT_TYPE.FETCH_DOCUMENT_TYPE_LIST_SUCCESS,
  data,
});

export const fetchDocFailure = () => ({
  type: SETTING_REDUX_CONSTANTS.DOCUMENT_TYPE.FETCH_DOCUMENT_TYPE_LIST_FAILURE,
});

export const resetPageDataFilters = () => ({
  type: SETTING_REDUX_CONSTANTS.DOCUMENT_TYPE.RESET_PAGE_DATA,
});

export const updateDocumentSingleField = (name, value) => ({
  type: SETTING_REDUX_CONSTANTS.DOCUMENT_TYPE.ADD_DOCUMENT_TYPE.UPDATE_DOCUMENT_TYPE_FIELDS,
  name,
  value,
});

export const resetAddDocType = () => ({
  type: SETTING_REDUX_CONSTANTS.DOCUMENT_TYPE.ADD_DOCUMENT_TYPE.RESET_ADD_DOC_TYPE_DATA,
});

export const getDocTypeById = data => ({
  type: SETTING_REDUX_CONSTANTS.DOCUMENT_TYPE.EDIT_DOCUMENT_TYPE.GET_DOCTYPE_DETAIL,
  data,
});

export const fetchOrgDetailRequest = data => ({
  type: SETTING_REDUX_CONSTANTS.ORGANIZATION_DETAILS.FETCH_ORGANIZATION_DETAILS_REQUEST,
  data,
});

export const fetchOrgDetailSuccess = data => ({
  type: SETTING_REDUX_CONSTANTS.ORGANIZATION_DETAILS.FETCH_ORGANIZATION_DETAILS_SUCCESS,
  data,
});

export const updateOrgDetails = data => ({
  type:
    SETTING_REDUX_CONSTANTS.ORGANIZATION_DETAILS.EDIT_ORGANIZATION_DETAILS
      .UPDATE_ORGANIZATION_DETAILS,
  data,
});

export const fetchApiIntegrationSuccess = data => ({
  type: SETTING_REDUX_CONSTANTS.API_INTEGRATION.FETCH_API_INTEGRATION_SUCCESS,
  data,
});

export const updateApiIntegration = data => ({
  type: SETTING_REDUX_CONSTANTS.API_INTEGRATION.EDIT_API_INTEGRATION.UPDATE_API_INTEGRATION_DATA,
  apiName: data.apiName,
});

export const fetchAuditLogList = data => ({
  type: SETTING_REDUX_CONSTANTS.AUDIT_LOG.FETCH_AUDIT_LOG_LIST_SUCCESS,
  data,
});

export const resetAuditLog = () => ({
  type: SETTING_REDUX_CONSTANTS.AUDIT_LOG.RESET_AUDIT_LOG_LIST_DATA,
});

export const getAuditUserList = data => ({
  type: SETTING_REDUX_CONSTANTS.AUDIT_LOG.GET_AUDIT_USER_TYPE_LIST_DATA,
  data,
});

export const getSettingDocumentTypeList = (params = { page: 1, limit: 15 }) => {
  return async dispatch => {
    try {
      startGeneralLoaderOnRequest('settingDocumentListLoader');
      const response = await SettingDocumentTypeApiServices.getDocumentListData(params);
      if (response?.data?.status === 'SUCCESS') {
        dispatch(fetchDocSuccess(response.data.data));
        stopGeneralLoaderOnSuccessOrFail('settingDocumentListLoader');
      }
    } catch (e) {
      stopGeneralLoaderOnSuccessOrFail('settingDocumentListLoader');
      displayErrors(e);
    }
  };
};

export const resetPageData = () => {
  return async dispatch => {
    dispatch(resetPageDataFilters());
  };
};

export const updateDocumentFieldStatus = (name, value) => {
  return dispatch => {
    dispatch(updateDocumentSingleField(name, value));
  };
};

export const addNewSettingDocType = (data, cb) => {
  return async () => {
    try {
      startGeneralLoaderOnRequest('settingAddNewDocumentTypeButtonLoaderAction');
      const response = await SettingDocumentTypeApiServices.addNewDocumentType(data);
      if (response?.data?.status === 'SUCCESS') {
        successNotification(response?.data?.message || 'New document type added successfully');
        stopGeneralLoaderOnSuccessOrFail('settingAddNewDocumentTypeButtonLoaderAction');
        cb();
      }
    } catch (e) {
      stopGeneralLoaderOnSuccessOrFail('settingAddNewDocumentTypeButtonLoaderAction');
      displayErrors(e);
    }
  };
};

export const getDocumentTypeDetailsById = id => {
  return async dispatch => {
    try {
      const response = await SettingDocumentTypeApiServices.getDocumentTypeDetailsById(id);
      if (response?.data?.status === 'SUCCESS') {
        dispatch(getDocTypeById(response.data.data));
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const updateSettingDocType = (id, data, cb) => {
  return async () => {
    try {
      startGeneralLoaderOnRequest('settingUpdateDocumentTypeButtonLoaderAction');
      const response = await SettingDocumentTypeApiServices.editDocumentTypeById(id, data);
      if (response?.data?.status === 'SUCCESS') {
        successNotification(response?.data?.message || 'Document type updated successfully');
        stopGeneralLoaderOnSuccessOrFail('settingUpdateDocumentTypeButtonLoaderAction');
        cb();
      }
    } catch (e) {
      stopGeneralLoaderOnSuccessOrFail('settingUpdateDocumentTypeButtonLoaderAction');
      displayErrors(e);
    }
  };
};

export const deleteSettingDocumentType = (id, cb) => {
  return async () => {
    try {
      startGeneralLoaderOnRequest('settingDeleteDocumentTypeButtonLoaderAction');
      const response = await SettingDocumentTypeApiServices.deleteDocumentType(id);
      if (response?.data?.status === 'SUCCESS') {
        successNotification(response?.data?.message || 'Document type deleted successfully.');
        stopGeneralLoaderOnSuccessOrFail('settingDeleteDocumentTypeButtonLoaderAction');
        if (cb) {
          cb();
        }
      }
    } catch (e) {
      stopGeneralLoaderOnSuccessOrFail('settingDeleteDocumentTypeButtonLoaderAction');
      displayErrors(e);
    }
  };
};

export const getApiIntegration = data => {
  return async dispatch => {
    try {
      startGeneralLoaderOnRequest('settingApiIntegrationDetailsLoader');
      const response = await SettingApiIntegrationService.getApiIntegrationDetails(data);
      if (response?.data?.status === 'SUCCESS') {
        dispatch(fetchApiIntegrationSuccess(response.data.data.integration));

        stopGeneralLoaderOnSuccessOrFail('settingApiIntegrationDetailsLoader');
      }
    } catch (e) {
      stopGeneralLoaderOnSuccessOrFail('settingApiIntegrationDetailsLoader');
      displayErrors(e);
    }
  };
};

export const changeApiIntegrationDetails = data => {
  return async dispatch => {
    dispatch({
      type:
        SETTING_REDUX_CONSTANTS.API_INTEGRATION.EDIT_API_INTEGRATION.CHANGE_API_INTEGRATION_DATA,
      data,
    });
  };
};

export const updateApiIntegrationDetails = data => {
  return async dispatch => {
    try {
      startGeneralLoaderOnRequest(`settingApiIntegrationButtonLoaderAction`);
      const response = await SettingApiIntegrationService.updateApiIntegrationDetails(data);
      if (response?.data?.status === 'SUCCESS') {
        successNotification(
          response?.data?.message || 'API integration details tested successfully'
        );
        stopGeneralLoaderOnSuccessOrFail(`settingApiIntegrationButtonLoaderAction`);
        dispatch(updateApiIntegration(data));
      }
    } catch (e) {
      stopGeneralLoaderOnSuccessOrFail(`settingApiIntegrationButtonLoaderAction`);
      displayErrors(e);
    }
  };
};

export const testApiIntegrationDetails = params => {
  return async () => {
    try {
      startGeneralLoaderOnRequest(`settingApiIntegrationTestButtonLoaderAction`);
      const response = await SettingApiIntegrationService.testApiIntegrationDetails(params);
      if (response?.data?.status === 'SUCCESS') {
        successNotification(
          response?.data?.message || 'API integration details updated successfully'
        );
        stopGeneralLoaderOnSuccessOrFail(`settingApiIntegrationTestButtonLoaderAction`);
      }
    } catch (e) {
      stopGeneralLoaderOnSuccessOrFail(`settingApiIntegrationTestButtonLoaderAction`);
      displayErrors(e);
    }
  };
};

export const getOrganizationDetails = data => {
  return async dispatch => {
    try {
      startGeneralLoaderOnRequest('settingOrganizationTabLoader');
      const response = await SettingOrganizationDetailsApiService.getOrganizationDetails(data);
      if (response?.data?.status === 'SUCCESS') {
        dispatch(fetchOrgDetailSuccess(response.data.data));
        stopGeneralLoaderOnSuccessOrFail('settingOrganizationTabLoader');
      }
    } catch (e) {
      stopGeneralLoaderOnSuccessOrFail('settingOrganizationTabLoader');
      displayErrors(e);
    }
  };
};

export const changeOrganizationDetails = data => {
  return async dispatch => {
    dispatch({
      type:
        SETTING_REDUX_CONSTANTS.ORGANIZATION_DETAILS.EDIT_ORGANIZATION_DETAILS
          .CHANGE_ORGANIZATION_DETAILS,
      data,
    });
  };
};

export const updateOrganizationDetails = data => {
  return async dispatch => {
    try {
      startGeneralLoaderOnRequest('settingUpdateOrganizationDetailsButtonLoaderAction');
      const response = await SettingOrganizationDetailsApiService.updateOrganizationDetails(data);
      if (response?.data?.status === 'SUCCESS') {
        dispatch(updateOrgDetails(response.data.data));
        successNotification(
          response?.data?.message || 'Organization details updated successfully.'
        );
        stopGeneralLoaderOnSuccessOrFail('settingUpdateOrganizationDetailsButtonLoaderAction');
      }
    } catch (e) {
      stopGeneralLoaderOnSuccessOrFail('settingUpdateOrganizationDetailsButtonLoaderAction');
      displayErrors(e);
    }
  };
};

export const getAuditLogsList = (params = { page: 1, limit: 15 }) => {
  return async dispatch => {
    try {
      startGeneralLoaderOnRequest('settingAuditLogTabLoader');
      const response = await SettingAuditLogApiService.getAuditLogList(params);
      if (response?.data?.status === 'SUCCESS') {
        dispatch(fetchAuditLogList(response.data.data));
        stopGeneralLoaderOnSuccessOrFail('settingAuditLogTabLoader');
      }
    } catch (e) {
      stopGeneralLoaderOnSuccessOrFail('settingAuditLogTabLoader');
      displayErrors(e);
    }
  };
};

export const getAuditLogColumnNameList = () => {
  return async dispatch => {
    try {
      const response = await SettingAuditLogApiService.getAuditLogColumnNameList();
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: SETTING_REDUX_CONSTANTS.AUDIT_LOG.AUDIT_LOG_COLUMN_LIST_ACTION,
          data: response.data.data,
        });
        dispatch({
          type: SETTING_REDUX_CONSTANTS.AUDIT_LOG.AUDIT_LOG_DEFAULT_COLUMN_LIST_ACTION,
          data: response.data.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const changeAuditLogColumnListStatus = data => {
  return async dispatch => {
    dispatch({
      type: SETTING_REDUX_CONSTANTS.AUDIT_LOG.UPDATE_AUDIT_LOG_COLUMN_LIST_ACTION,
      data,
    });
  };
};

export const saveAuditLogColumnNameList = ({ auditLogColumnNameList = {}, isReset = false }) => {
  return async dispatch => {
    try {
      startGeneralLoaderOnRequest(
        `settingAuditLogColumn${isReset ? 'Reset' : 'Save'}ButtonLoaderAction`
      );
      let data = {
        isReset: true,
        columns: [],
      };

      if (!isReset) {
        const defaultFields = auditLogColumnNameList.defaultFields
          .filter(e => e.isChecked)
          .map(e => e.name);
        const customFields = auditLogColumnNameList.customFields
          .filter(e => e.isChecked)
          .map(e => e.name);
        data = {
          isReset: false,
          columns: [...defaultFields, ...customFields],
        };
        if (data.columns.length < 1) {
          errorNotification('Please select at least one column to continue.');
          stopGeneralLoaderOnSuccessOrFail(
            `settingAuditLogColumn${isReset ? 'Reset' : 'Save'}ButtonLoaderAction`
          );
          throw Error();
        }
      }
      const response = await SettingAuditLogApiService.updateAuditLogColumnNameList(data);
      if (response && response.data && response?.data?.status === 'SUCCESS') {
        successNotification(response?.data?.message || 'Columns updated successfully.');
        dispatch({
          type: SETTING_REDUX_CONSTANTS.AUDIT_LOG.AUDIT_LOG_DEFAULT_COLUMN_LIST_ACTION,
          data: auditLogColumnNameList,
        });
        stopGeneralLoaderOnSuccessOrFail(
          `settingAuditLogColumn${isReset ? 'Reset' : 'Save'}ButtonLoaderAction`
        );
      }
    } catch (e) {
      stopGeneralLoaderOnSuccessOrFail(
        `settingAuditLogColumn${isReset ? 'Reset' : 'Save'}ButtonLoaderAction`
      );
      displayErrors(e);
    }
  };
};

export const resetAuditLogList = () => {
  return async dispatch => {
    dispatch(resetAuditLog());
  };
};

export const getAuditUserName = () => {
  return async dispatch => {
    try {
      const response = await SettingAuditLogApiService.getAuditUserNameList();
      if (response?.data?.status === 'SUCCESS') {
        dispatch(getAuditUserList(response.data.data));
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const setSettingActiveTabIndex = index => {
  store.dispatch({
    type: SETTING_REDUX_CONSTANTS.SETTING_ACTIVE_TAB_INDEX,
    index,
  });
};

export const resetSettingTabsData = () => {
  return dispatch => {
    dispatch({
      type: SETTING_REDUX_CONSTANTS.RESET_SETTING_TAB_DATA,
    });
  };
};
