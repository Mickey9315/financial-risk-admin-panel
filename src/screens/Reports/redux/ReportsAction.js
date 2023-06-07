import _ from 'lodash';
import {
  startGeneralLoaderOnRequest,
  stopGeneralLoaderOnSuccessOrFail,
} from '../../../common/GeneralLoader/redux/GeneralLoaderAction';
import { errorNotification, successNotification } from '../../../common/Toast';
import { displayErrors } from '../../../helpers/ErrorNotifyHelper';
import { DashboardApiService } from '../../Dashboard/services/DashboardApiService';
import { ReportsApiService } from '../services/ReportsApiService';
import { REPORTS_REDUX_CONSTANTS } from './ReportsReduxConstants';

export const getReportList = (params, currentFilter) => {
  return async dispatch => {
    try {
      const finalParams = {};
      // eslint-disable-next-line no-unused-vars
      Object.entries(params).forEach(([key, value]) => {
        if (_.isArray(value)) {
          finalParams[key] = value
            ?.map(record =>
              currentFilter === 'claimsReport' ? record?.secondValue : record?.value
            )
            .join(',');
        } else if (_.isObject(value)) {
          finalParams[key] = currentFilter === 'claimsReport' ? value?.secondValue : value?.value;
        } else {
          finalParams[key] = value || undefined;
        }
      });
      const response = await ReportsApiService.getReportsList(finalParams);
      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: REPORTS_REDUX_CONSTANTS.GET_REPORT_LIST_SUCCESS,
          data: response?.data?.data,
        });
        stopGeneralLoaderOnSuccessOrFail('viewReportListLoader');
        stopGeneralLoaderOnSuccessOrFail('onlyReportListLoader');
      }
    } catch (e) {
      stopGeneralLoaderOnSuccessOrFail('viewReportListLoader');
      stopGeneralLoaderOnSuccessOrFail('onlyReportListLoader');
      displayErrors(e);
    }
  };
};

export const getReportColumnList = reportFor => {
  return async dispatch => {
    try {
      const params = {
        columnFor: reportFor,
      };
      const response = await ReportsApiService.getReportsColumnList(params);
      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: REPORTS_REDUX_CONSTANTS.GET_REPORT_COLUMN_LIST,
          data: response?.data?.data,
        });
        dispatch({
          type: REPORTS_REDUX_CONSTANTS.GET_REPORT_DEFAULT_COLUMN_LIST,
          data: response?.data?.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const changeReportColumnList = data => {
  return dispatch => {
    dispatch({
      type: REPORTS_REDUX_CONSTANTS.UPDATE_REPORT_COLUMN_LIST,
      data,
    });
  };
};

export const saveReportColumnList = ({ reportColumnList = {}, isReset = false, reportFor }) => {
  return async dispatch => {
    try {
      startGeneralLoaderOnRequest(
        `reportListColumn${isReset ? 'Reset' : 'Save'}ButtonLoaderAction`
      );
      let data = {
        isReset: true,
        columns: [],
        columnFor: reportFor,
      };
      if (!isReset) {
        const defaultFields = reportColumnList.defaultFields
          .filter(field => field.isChecked)
          .map(e => e.name);
        const customFields = reportColumnList.customFields
          .filter(field => field.isChecked)
          .map(e => e.name);
        data = {
          isReset: false,
          columns: [...defaultFields, ...customFields],
          columnFor: reportFor,
        };
        if (data.columns.length < 1) {
          errorNotification('Please select at least one column to continue.');
          stopGeneralLoaderOnSuccessOrFail(
            `reportListColumn${isReset ? 'Reset' : 'Save'}ButtonLoaderAction`
          );
          throw Error();
        }
      }
      const response = await ReportsApiService.updateReportsColumnList(data);
      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: REPORTS_REDUX_CONSTANTS.GET_REPORT_DEFAULT_COLUMN_LIST,
          data: reportColumnList,
        });
        successNotification('Columns updated successfully');
        stopGeneralLoaderOnSuccessOrFail(
          `reportListColumn${isReset ? 'Reset' : 'Save'}ButtonLoaderAction`
        );
      }
    } catch (e) {
      stopGeneralLoaderOnSuccessOrFail(
        `reportListColumn${isReset ? 'Reset' : 'Save'}ButtonLoaderAction`
      );
      displayErrors(e);
      throw Error();
    }
  };
};

export const getReportsClientDropdownData = () => {
  return async dispatch => {
    try {
      const response = await ReportsApiService.getReportClientList();

      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: REPORTS_REDUX_CONSTANTS.GET_DROPDOWN_CLIENT_LIST,
          data: response?.data?.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const changeReportsFilterFields = (filterFor, name, value) => {
  return async dispatch => {
    dispatch({
      type: REPORTS_REDUX_CONSTANTS.UPDATE_REPORT_FILTER_FIELDS,
      filterFor,
      name,
      value,
    });
  };
};

export const resetCurrentFilter = filterFor => {
  return async dispatch => {
    await dispatch({
      type: REPORTS_REDUX_CONSTANTS.RESET_REPORT_FILTER,
      filterFor,
    });
  };
};

export const reportDownloadAction = async (reportFor, filters) => {
  startGeneralLoaderOnRequest('reportDownloadButtonLoaderAction');
  const finalFilters = {};
  Object.entries(filters).forEach(([key, value]) => {
    if (_.isArray(value)) {
      finalFilters[key] = value
        ?.map(record => (reportFor === 'claimsReport' ? record?.secondValue : record?.value))
        .join(',');
    } else if (_.isObject(value)) {
      finalFilters[key] = reportFor === 'claimsReport' ? value?.secondValue : value?.value;
    } else {
      finalFilters[key] = value || undefined;
    }
  });
  const config = {
    columnFor: reportFor,
    ...finalFilters,
  };
  try {
    const response = await ReportsApiService.downloadReportList(config);
    if (response?.statusText === 'OK') {
      stopGeneralLoaderOnSuccessOrFail(`reportDownloadButtonLoaderAction`);
      return response;
    }
  } catch (e) {
    stopGeneralLoaderOnSuccessOrFail(`reportDownloadButtonLoaderAction`);
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

export const resetReportListData = () => {
  return dispatch => {
    dispatch({
      type: REPORTS_REDUX_CONSTANTS.RESET_REPORT_LIST_DATA,
    });
  };
};

export const applyFinalFilter = filterFor => {
  return dispatch => {
    dispatch({
      type: REPORTS_REDUX_CONSTANTS.APPLY_REPORT_FILTER_ACTION,
      filterFor,
    });
  };
};

export const getReportsFilterDropDownDataBySearch = options => {
  return async dispatch => {
    try {
      const response = await DashboardApiService.getEntitiesBySearch({
        ...options,
        isForRisk: true,
      });

      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: REPORTS_REDUX_CONSTANTS.GET_DROPDOWN_LIST_BY_SEARCH,
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
      const response = await ReportsApiService.getAlertFilterDropdownData();
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: REPORTS_REDUX_CONSTANTS.GET_ALERT_FILTER_DROPDOWN_DATA,
          data: response.data.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};
