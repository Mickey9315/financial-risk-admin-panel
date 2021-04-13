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

export const fetchApiIntegrationSuccess = data => ({
  type: SETTING_REDUX_CONSTANTS.API_INTEGRATION.FETCH_API_INTEGRATION_SUCCESS,
  data,
});

export const fetchAuditLogList = data => ({
  type: SETTING_REDUX_CONSTANTS.AUDIT_LOG.FETCH_AUDIT_LOG_LIST_SUCCESS,
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
    const response = await SettingDocumentTypeApiServices.addNewDocumentType(data);
    if (response.data.status === 'SUCCESS') {
      successNotification(response.data.message);
      cb();
      dispatch(resetAddDocType());
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
          errorNotification('Internal server error');
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
        dispatch(fetchApiIntegrationSuccess(response.data.data));
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
