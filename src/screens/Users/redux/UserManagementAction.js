import { errorNotification, successNotification } from '../../../common/Toast';
import UserManagementApiService from '../services/UserManagementApiService';
import {
  ORGANISATION_MODULE_REDUX_CONSTANTS,
  USER_MANAGEMENT_CLIENT_LIST_REDUX_CONSTANTS,
  USER_MANAGEMENT_COLUMN_LIST_REDUX_CONSTANTS,
  USER_MANAGEMENT_CRUD_REDUX_CONSTANTS,
  USER_MANAGEMENT_REDUX_CONSTANTS,
} from './UserManagementReduxConstants';

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
        dispatch(getUserManagementListByFilter());
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

export const setNewUserInitialStates = moduleAccess => {
  const data = {
    name: '',
    role: '',
    email: '',
    contactNumber: '',
    moduleAccess,
  };
  return async dispatch => {
    dispatch({
      type: USER_MANAGEMENT_CRUD_REDUX_CONSTANTS.USER_MANAGEMENT_GET_USER_ACTION,
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

export const getAllOrganisationModulesList = () => {
  return async dispatch => {
    try {
      const response = await UserManagementApiService.getAllOrganisationModuleList();

      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: ORGANISATION_MODULE_REDUX_CONSTANTS.GET_ORGANISATION_MODULE_REDUX_ACTION,
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

export const getAllClientList = () => {
  return async dispatch => {
    try {
      const response = await UserManagementApiService.getClientList();

      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: USER_MANAGEMENT_CLIENT_LIST_REDUX_CONSTANTS.USER_MANAGEMENT_CLIENT_LIST_ACTION,
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

export const changeUserData = data => {
  return async dispatch => {
    dispatch({
      type: USER_MANAGEMENT_CRUD_REDUX_CONSTANTS.USER_MANAGEMENT_UPDATE_USER_ACTION,
      data,
    });
  };
};

export const changeUserManageAccess = data => {
  return async dispatch => {
    dispatch({
      type: USER_MANAGEMENT_CRUD_REDUX_CONSTANTS.USER_MANAGEMENT_CHANGE_MANAGE_ACCESS_USER_ACTION,
      data,
    });
  };
};

export const addNewUser = data => {
  return async dispatch => {
    try {
      const finalData = {
        ...data,
        clientIds: data.clientIds ? data.clientIds.map(e => e.value) : [],
      };

      const response = await UserManagementApiService.addNewUser(finalData);

      if (response.data.status === 'SUCCESS') {
        successNotification('Added user successfully.');
        dispatch(getUserManagementListByFilter());
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

export const updateUserDetails = (id, data) => {
  return async dispatch => {
    try {
      const finalData = {
        ...data,
        clientIds: data.clientIds ? data.clientIds.map(e => e.value) : [],
        _id: undefined,
        email: undefined,
      };

      const response = await UserManagementApiService.updateUser(id, finalData);

      if (response.data.status === 'SUCCESS') {
        successNotification('User details updated successfully.');
        dispatch(getUserManagementListByFilter());
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

export const deleteUserDetails = id => {
  return async dispatch => {
    try {
      const response = await UserManagementApiService.deleteUser(id);

      if (response.data.status === 'SUCCESS') {
        successNotification('User deleted successfully.');
        dispatch(getUserManagementListByFilter());
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
