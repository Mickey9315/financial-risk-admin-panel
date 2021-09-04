import { displayErrors } from '../../../helpers/ErrorNotifyHelper';
import { ReportsApiService } from '../services/ReportsApiService';
import { REPORTS_REDUX_CONSTANTS } from './ReportsReduxConstants';
import {
  startGeneralLoaderOnRequest,
  stopGeneralLoaderOnSuccessOrFail,
} from '../../../common/GeneralLoader/redux/GeneralLoaderAction';
import { errorNotification, successNotification } from '../../../common/Toast';

export const getReportList = params => {
  return async dispatch => {
    try {
      const response = await ReportsApiService.getReportsList(params);
      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: REPORTS_REDUX_CONSTANTS.GET_REPORT_LIST_SUCCESS,
          data: response?.data?.data,
        });
        stopGeneralLoaderOnSuccessOrFail('viewReportListLoader');
      }
    } catch (e) {
      stopGeneralLoaderOnSuccessOrFail('viewReportListLoader');
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
  const config = {
    columnFor: reportFor,
    ...filters,
  };
  try {
    const response = await ReportsApiService.downloadReportList(config);
    if (response?.statusText === 'OK') {
      stopGeneralLoaderOnSuccessOrFail(`reportDownloadButtonLoaderAction`);
      return response;
    }
  } catch (e) {
    stopGeneralLoaderOnSuccessOrFail(`reportDownloadButtonLoaderAction`);
    displayErrors(e);
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
