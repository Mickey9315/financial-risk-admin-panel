import { errorNotification, successNotification } from '../../../common/Toast';
import UserManagementApiService from '../services/UserManagementApiService';
import {
  USER_MANAGEMENT_COLUMN_LIST_REDUX_CONSTANTS,
  USER_MANAGEMENT_CRUD_REDUX_CONSTANTS,
  USER_MANAGEMENT_REDUX_CONSTANTS,
} from './UserManagementReduxConstants';

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

export const getUserColumnListName = () => {
  return async dispatch => {
    try {
      const response = await UserManagementApiService.getUserColumnListName();

      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: USER_MANAGEMENT_COLUMN_LIST_REDUX_CONSTANTS.USER_MANAGEMENT_COLUMN_LIST_ACTION,
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
          errorNotification('It seems like server is down, Please try again later.');
        }
        throw Error();
      }
    }
  };
};

export const saveUserColumnListName = ({ userColumnList = {}, isReset = false }) => {
  return async dispatch => {
    try {
      let data = {
        isReset: true,
        columns: [],
      };

      if (!isReset) {
        const defaultColumns = userColumnList.defaultFields
          .filter(e => e.isChecked)
          .map(e => e.name);
        const customFields = userColumnList.customFields.filter(e => e.isChecked).map(e => e.name);
        data = {
          isReset: false,
          columns: [...defaultColumns, ...customFields],
        };
      }

      const response = await UserManagementApiService.updateUserColumnListName(data);

      if (response && response.data && response.data.status === 'SUCCESS') {
        dispatch(getUserManagementList());
        successNotification('Columns updated successfully.');
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

export const changeUserColumnListStatus = data => {
  return async dispatch => {
    dispatch({
      type: USER_MANAGEMENT_COLUMN_LIST_REDUX_CONSTANTS.UPDATE_USER_MANAGEMENT_COLUMN_LIST_ACTION,
      data,
    });
  };
};

export const getSelectedUserData = id => {
  return async dispatch => {
    try {
      const response = await UserManagementApiService.getSelectedUserData(id);

      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: USER_MANAGEMENT_CRUD_REDUX_CONSTANTS.USER_MANAGEMENT_GET_USER_ACTION,
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
          errorNotification('It seems like server is down, Please try again later.');
        }
        throw Error();
      }
    }
  };
};
