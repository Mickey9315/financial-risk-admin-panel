import SettingDocumentTypeApiServices from '../services/SettingDocumentTypeApiServices';
import { SETTING_REDUX_CONSTANTS } from './SettingReduxConstants';
import { errorNotification, successNotification } from '../../../common/Toast';
import SettingOrganizationDetailsApiService from '../services/SettingOrganizationDetailsApiService';
import SettingApiIntegrationService from '../services/SettingApiIntegrationService';
import SettingAuditLogApiService from '../services/SettingAuditLogApiService';

export const fetchDocRequest = () => ({
  type: SETTING_REDUX_CONSTANTS.DOCUMENT_TYPE.FETCH_DOCUMENT_TYPE_LIST_REQUEST,
});

export const fetchDocSuccess = data => ({
  type: SETTING_REDUX_CONSTANTS.DOCUMENT_TYPE.FETCH_DOCUMENT_TYPE_LIST_SUCCESS,
  data,
});

export const fetchDocFailure = error => ({
  type: SETTING_REDUX_CONSTANTS.DOCUMENT_TYPE.FETCH_DOCUMENT_TYPE_LIST_FAILURE,
  error,
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
      // dispatch(fetchDocRequest());
      const response = await SettingDocumentTypeApiServices.getDocumentListData(params);
      if (response.data.status === 'SUCCESS') {
        dispatch(fetchDocSuccess(response.data.data));
      }
    } catch (e) {
      if (e.response && e.response.data) {
        dispatch(fetchDocFailure(e));
        if (e.response.data.status === undefined) {
          errorNotification('It seems like server is down, Please try again later.');
        } else {
          errorNotification('Internal server error');
        }
      }
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
  return async dispatch => {
    try {
      const response = await SettingDocumentTypeApiServices.addNewDocumentType(data);
      if (response.data.status === 'SUCCESS') {
        successNotification('New document type added successfully');
        cb();
        dispatch(resetAddDocType());
      }
    } catch (e) {
      if (e.response && e.response.data) {
        if (e.response.data.status === undefined) {
          errorNotification('It seems like server is down, Please try again later.');
        } else {
          errorNotification(e.response.data.message);
        }
      }
    }
  };
};

export const getDocumentTypeDetailsById = id => {
  return async dispatch => {
    try {
      const response = await SettingDocumentTypeApiServices.getDocumentTypeDetailsById(id);
      if (response.data.status === 'SUCCESS') {
        dispatch(getDocTypeById(response.data.data));
      }
    } catch (e) {
      if (e.response && e.response.data) {
        if (e.response.data.status === undefined) {
          errorNotification('It seems like server is down, Please try again later.');
        } else {
          errorNotification(e.response.data.message);
        }
      }
    }
  };
};

export const updateSettingDocType = (id, data, cb) => {
  return async dispatch => {
    try {
      const response = await SettingDocumentTypeApiServices.editDocumentTypeById(id, data);
      if (response.data.status === 'SUCCESS') {
        successNotification('Document type updated successfully');
        dispatch(resetAddDocType());
        cb();
      }
    } catch (e) {
      if (e.response && e.response.data) {
        if (e.response.data.status === undefined) {
          errorNotification('It seems like server is down, Please try again later.');
        } else {
          errorNotification('Internal server error');
        }
      }
    }
  };
};

export const deleteSettingDocumentType = (id, cb) => {
  return async () => {
    try {
      const response = await SettingDocumentTypeApiServices.deleteDocumentType(id);
      if (response.data.status === 'SUCCESS') {
        successNotification('Document type deleted successfully.');
        if (cb) {
          cb();
        }
      }
    } catch (e) {
      if (e.response && e.response.data) {
        if (e.response.data.status === undefined) {
          errorNotification('It seems like server is down, Please try again later.');
        } else {
          errorNotification('Internal server error');
        }
      }
    }
  };
};

export const getApiIntegration = data => {
  return async dispatch => {
    try {
      const response = await SettingApiIntegrationService.getApiIntegrationDetails(data);
      if (response.data.status === 'SUCCESS') {
        dispatch(fetchApiIntegrationSuccess(response.data.data.integration));
      }
    } catch (e) {
      if (e.response && e.response.data) {
        if (e.response.data.status === undefined) {
          errorNotification('It seems like server is down, Please try again later.');
        } else {
          errorNotification('Internal server error');
        }
      }
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
      const response = await SettingApiIntegrationService.updateApiIntegrationDetails(data);
      if (response.data.status === 'SUCCESS') {
        successNotification('API integration details updated successfully');
        dispatch(updateApiIntegration(data));
      }
    } catch (e) {
      if (e.response && e.response.data) {
        if (e.response.data.status === undefined) {
          errorNotification('It seems like server is down, Please try again later.');
        } else if (e.response.data.status === 'ERROR') {
          errorNotification(e.response.data.message);
        } else {
          errorNotification('Internal server error');
        }
      }
    }
  };
};

export const getOrganizationDetails = data => {
  return async dispatch => {
    try {
      const response = await SettingOrganizationDetailsApiService.getOrganizationDetails(data);
      if (response.data.status === 'SUCCESS') {
        dispatch(fetchOrgDetailSuccess(response.data.data));
      }
    } catch (e) {
      if (e.response && e.response.data) {
        if (e.response.data.status === undefined) {
          errorNotification('It seems like server is down, Please try again later.');
        } else {
          errorNotification('Internal server error');
        }
      }
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
      const response = await SettingOrganizationDetailsApiService.updateOrganizationDetails(data);
      if (response.data.status === 'SUCCESS') {
        dispatch(updateOrgDetails(response.data.data));
        successNotification('Organization details updated successfully.');
      }
    } catch (e) {
      if (e.response && e.response.data) {
        if (e.response.data.status === undefined) {
          errorNotification('It seems like server is down, Please try again later.');
        } else if (e.response.data.status === 'ERROR') {
          errorNotification(e.response.data.message);
        } else {
          errorNotification('Internal server error');
        }
      }
    }
  };
};

export const getAuditLogsList = (params = { page: 1, limit: 15 }) => {
  return async dispatch => {
    try {
      const response = await SettingAuditLogApiService.getAuditLogList(params);
      if (response.data.status === 'SUCCESS') {
        dispatch(fetchAuditLogList(response.data.data));
      }
    } catch (e) {
      if (e.response && e.response.data) {
        dispatch(fetchDocFailure(e));
        if (e.response.data.status === undefined) {
          errorNotification('It seems like server is down, Please try again later.');
        } else {
          errorNotification('Internal server error');
        }
      }
    }
  };
};

export const getAuditLogColumnNameList = () => {
  return async dispatch => {
    try {
      const response = await SettingAuditLogApiService.getAuditLogColumnNameList();
      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: SETTING_REDUX_CONSTANTS.AUDIT_LOG.AUDIT_LOG_COLUMN_LIST_ACTION,
          data: response.data.data,
        });
      }
    } catch (e) {
      if (e.response && e.response.data) {
        if (e.response.data.status === undefined) {
          errorNotification('It seems like server is down, Please try again later.');
        } else if (e.response.data.status === 'INTERNAL_SERVER_ERROR') {
          errorNotification('Internal server error');
        } else if (e.response.data.status === 'ERROR') {
          errorNotification(e.response.data.message);
        }
        throw Error();
      }
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

export const saveAuditLogColumnNameList = ({ auditLogColumnList = {}, isReset = false }) => {
  return async dispatch => {
    try {
      let data = {
        isReset: true,
        columns: [],
      };

      if (!isReset) {
        const defaultFields = auditLogColumnList.defaultFields
          .filter(e => e.isChecked)
          .map(e => e.name);
        const customFields = auditLogColumnList.customFields
          .filter(e => e.isChecked)
          .map(e => e.name);
        data = {
          isReset: false,
          columns: [...defaultFields, ...customFields],
        };
      }
      if (!isReset && data.columns.length < 1) {
        errorNotification('Please select at least one column to continue.');
        dispatch(getAuditLogColumnNameList());
      } else {
        const response = await SettingAuditLogApiService.updateAuditLogColumnNameList(data);
        if (response && response.data && response.data.status === 'SUCCESS') {
          successNotification('Columns updated successfully.');
        }
      }
    } catch (e) {
      if (e.response && e.response.data) {
        if (e.response.data.status === undefined) {
          errorNotification('It seems like server is down, Please try again later.');
        } else if (e.response.data.status === 'INTERNAL_SERVER_ERROR') {
          errorNotification('Internal server error');
        } else if (e.response.data.status === 'ERROR') {
          errorNotification('It seems like server is down, Please try again later.');
        }
        throw Error();
      }
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
      if (response.data.status === 'SUCCESS') {
        dispatch(getAuditUserList(response.data.data));
      }
    } catch (e) {
      if (e.response && e.response.data) {
        if (e.response.data.status === undefined) {
          errorNotification('It seems like server is down, Please try again later.');
        } else if (e.response.data.status === 'INTERNAL_SERVER_ERROR') {
          errorNotification('Internal server error');
        } else if (e.response.data.status === 'ERROR') {
          errorNotification('It seems like server is down, Please try again later.');
        }
        throw Error();
      }
    }
  };
};
