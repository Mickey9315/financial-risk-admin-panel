import _ from 'lodash';
import {
  startGeneralLoaderOnRequest,
  stopGeneralLoaderOnSuccessOrFail
} from '../../../common/GeneralLoader/redux/GeneralLoaderAction';
import { errorNotification, successNotification } from '../../../common/Toast';
import { displayErrors } from '../../../helpers/ErrorNotifyHelper';
import { DashboardApiService } from '../../Dashboard/services/DashboardApiService';
import { AlertsApiService } from '../services/AlertsApiService';
import { ALERTS_REDUX_CONSTANTS } from './AlertsReduxConstants';

export const getAlertsList = (params) => {
  return async dispatch => {
    try {
      const finalParams = {};
      // eslint-disable-next-line no-unused-vars
      Object.entries(params).forEach(([key, value]) => {
        if (_.isArray(value)) {
          finalParams[key] = value
            ?.map(record => record?.value)
            .join(',');
        } else if (_.isObject(value)) {
          finalParams[key] = value?.value;
        } else {
          finalParams[key] = value || undefined;
        }
      });
      const response = await AlertsApiService.getAlertsList(finalParams);
      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: ALERTS_REDUX_CONSTANTS.GET_ALERT_LIST_SUCCESS,
          data: response?.data?.data,
        });
        stopGeneralLoaderOnSuccessOrFail('viewAlertListLoader');
        stopGeneralLoaderOnSuccessOrFail('onlyAlertListLoader');
      }
    } catch (e) {
      stopGeneralLoaderOnSuccessOrFail('viewAlertListLoader');
      stopGeneralLoaderOnSuccessOrFail('onlyAlertListLoader');
      displayErrors(e);
    }
  };
};

export const getAlertColumnList = () => {
  return async dispatch => {
    try {
      const response = await AlertsApiService.getAlertsColumnList();
      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: ALERTS_REDUX_CONSTANTS.GET_ALERT_COLUMN_LIST,
          data: response?.data?.data,
        });
        dispatch({
          type: ALERTS_REDUX_CONSTANTS.GET_ALERT_DEFAULT_COLUMN_LIST,
          data: response?.data?.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const changeAlertColumnList = data => {
  return dispatch => {
    dispatch({
      type: ALERTS_REDUX_CONSTANTS.UPDATE_ALERT_COLUMN_LIST,
      data,
    });
  };
};

export const saveAlertColumnList = ({ alertColumnList = {}, isReset = false}) => {
  return async dispatch => {
    try {
      startGeneralLoaderOnRequest(
        `alertListColumn${isReset ? 'Reset' : 'Save'}ButtonLoaderAction`
      );
      let data = {
        isReset: true,
        columns: [],
      };
      if (!isReset) {
        const defaultFields = alertColumnList.defaultFields
          .filter(field => field.isChecked)
          .map(e => e.name);
        const customFields = alertColumnList.customFields
          .filter(field => field.isChecked)
          .map(e => e.name);
        data = {
          isReset: false,
          columns: [...defaultFields, ...customFields],
        };
        if (data.columns.length < 1) {
          errorNotification('Please select at least one column to continue.');
          stopGeneralLoaderOnSuccessOrFail(
            `alertListColumn${isReset ? 'Reset' : 'Save'}ButtonLoaderAction`
          );
          throw Error();
        }
      }
      const response = await AlertsApiService.updateAlertsColumnList(data);
      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: ALERTS_REDUX_CONSTANTS.GET_ALERT_DEFAULT_COLUMN_LIST,
          data: alertColumnList,
        });
        successNotification('Columns updated successfully');
        stopGeneralLoaderOnSuccessOrFail(
          `alertListColumn${isReset ? 'Reset' : 'Save'}ButtonLoaderAction`
        );
      }
    } catch (e) {
      stopGeneralLoaderOnSuccessOrFail(
        `alertListColumn${isReset ? 'Reset' : 'Save'}ButtonLoaderAction`
      );
      displayErrors(e);
      throw Error();
    }
  };
};

export const getAlertsClientDropdownData = () => {
  return async dispatch => {
    try {
      const response = await AlertsApiService.getAlertClientList();
      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: ALERTS_REDUX_CONSTANTS.GET_DROPDOWN_CLIENT_LIST,
          data: response?.data?.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const changeAlertsFilterFields = (name, value) => {
  return async dispatch => {
    dispatch({
      type: ALERTS_REDUX_CONSTANTS.UPDATE_ALERT_FILTER_FIELDS,
      name,
      value,
    });
  };
};

export const resetCurrentFilter = () => {
  return async dispatch => {
    await dispatch({
      type: ALERTS_REDUX_CONSTANTS.RESET_ALERT_FILTER,
    });
  };
};

export const alertDownloadAction = async (filters) => {
  startGeneralLoaderOnRequest('alertDownloadButtonLoaderAction');
  const finalFilters = {};
  Object.entries(filters).forEach(([key, value]) => {
    if (_.isArray(value)) {
      finalFilters[key] = value
        ?.map(record => record?.value)
        .join(',');
    } else if (_.isObject(value)) {
      finalFilters[key] = value?.value;
    } else {
      finalFilters[key] = value || undefined;
    }
  });
  const config = {
    ...finalFilters,
  };
  try {
    const response = await AlertsApiService.downloadAlertList(config);
    if (response?.statusText === 'OK') {
      stopGeneralLoaderOnSuccessOrFail(`alertDownloadButtonLoaderAction`);
      return response;
    }
  } catch (e) {
    stopGeneralLoaderOnSuccessOrFail(`alertDownloadButtonLoaderAction`);
    if (e?.response?.status === 400) {
      errorNotification(
        'User cannot download more than 500 records at a time. Please apply filter to narrow down the list'
      );
    } else {
      displayErrors(e);
    }
  }
  return false;
};

export const resetAlertListData = () => {
  return dispatch => {
    dispatch({
      type: ALERTS_REDUX_CONSTANTS.RESET_ALERT_LIST_DATA,
    });
  };
};

export const applyFinalFilter = () => {
  return dispatch => {
    dispatch({
      type: ALERTS_REDUX_CONSTANTS.APPLY_ALERT_FILTER_ACTION,
    });
  };
};

export const getAlertsFilterDropDownDataBySearch = options => {
  return async dispatch => {
    try {
      const response = await DashboardApiService.getEntitiesBySearch({
        ...options,
        isForRisk: true,
      });
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: ALERTS_REDUX_CONSTANTS.GET_DROPDOWN_LIST_BY_SEARCH,
          data: response?.data?.data,
          name: options.entityType,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const getAlertFilterDropdownData = () => {
  return async dispatch => {
    try {
      const response = await AlertsApiService.getAlertFilterDropdownData();
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: ALERTS_REDUX_CONSTANTS.GET_ALERT_FILTER_DROPDOWN_DATA,
          data: response.data.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const getAlertDetails = id => {
  return async dispatch => {
    try {
      startGeneralLoaderOnRequest('alertDetailsLoader');
      const response = await AlertsApiService.getAlertDetails(id);
      if (response?.data?.status === 'SUCCESS') {
        stopGeneralLoaderOnSuccessOrFail('alertDetailsLoader');
        dispatch({
          type: ALERTS_REDUX_CONSTANTS.GET_ALERT_DETAILS,
          data: response?.data?.data,
        });
      }
    } catch (e) {
      stopGeneralLoaderOnSuccessOrFail('alertDetailsLoader');
      displayErrors(e);
    }
  }
};

export const clearAlertDetails = () => {
  return dispatch => {
    dispatch({
      type: ALERTS_REDUX_CONSTANTS.CLEAR_ALERT_DETAILS,
    });
  };
};

export const updateAlertStatus = (alertId, data) => {
  return async () => {
    try {
      const response = await AlertsApiService.updateAlertStatus(alertId, data);
      if (response.data.status === 'SUCCESS') {
        console.log("sucess");
        // dispatch({
        //   type: ALERTS_REDUX_CONSTANTS.GET_DROPDOWN_CLIENT_LIST,
        //   data: response?.data?.data,
        // });
      }
    } catch (e) {
      displayErrors(e);
    }
  }
}