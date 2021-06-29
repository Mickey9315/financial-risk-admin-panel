import { DashboardApiService } from '../services/DashboardApiService';
import { DASHBOARD_REDUX_CONSTANTS } from './DashboardReduxConstants';
import { displayErrors } from '../../../helpers/ErrorNotifyHelper';
import {
  startGeneralLoaderOnRequest,
  stopGeneralLoaderOnSuccessOrFail,
} from '../../../common/GeneralLoader/redux/GeneralLoaderAction';

export const getDashboardUserList = () => {
  return async dispatch => {
    try {
      const response = await DashboardApiService.getDashboardUserList();
      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: DASHBOARD_REDUX_CONSTANTS.DASHBOARD_USER_LIST_DETAILS,
          data: response.data.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const getDashboardDetails = param => {
  return async dispatch => {
    const params = { users: param };
    try {
      startGeneralLoaderOnRequest('dashboardDetailsLoader');
      const response = await DashboardApiService.getDashboardDetails(params);
      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: DASHBOARD_REDUX_CONSTANTS.DASHBOARD_DETAILS,
          data: response.data.data,
        });
        stopGeneralLoaderOnSuccessOrFail('dashboardDetailsLoader');
      }
    } catch (e) {
      stopGeneralLoaderOnSuccessOrFail('dashboardDetailsLoader');
      displayErrors(e);
    }
  };
};

export const resetDashboardDetails = () => {
  return dispatch => {
    dispatch({
      type: DASHBOARD_REDUX_CONSTANTS.RESET_DASHBOARD_DETAILS,
    });
  };
};
