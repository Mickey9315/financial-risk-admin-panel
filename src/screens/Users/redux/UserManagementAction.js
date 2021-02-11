import { errorNotification } from '../../../common/Toast';
import UserManagementApiService from '../services/UserManagementApiService';
import { USER_MANAGEMENT_REDUX_CONSTANTS } from './UserManagementReduxConstants';

export const getUserManagementList = (params = { page: 1, limit: 15 }) => {
  return async dispatch => {
    try {
      const response = await UserManagementApiService.getAllUserList(params);

      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: USER_MANAGEMENT_REDUX_CONSTANTS.USER_MANAGEMENT_LIST_USER_ACTION,
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
          // TODO handle cases
          errorNotification('It seems like server is down, Please try again later.');
        }
        throw Error();
      }
    }
  };
};

export const getUserManagementListByFilter = (params = { page: 1, limit: 15 }) => {
  return async dispatch => {
    try {
      const response = await UserManagementApiService.getAllUserListByFilter(params);

      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: USER_MANAGEMENT_REDUX_CONSTANTS.USER_MANAGEMENT_LIST_USER_ACTION,
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
          // TODO handle cases
          errorNotification('It seems like server is down, Please try again later.');
        }
        throw Error();
      }
    }
  };
};
