import { errorNotification, successNotification } from '../../../common/Toast';
import UserManagementApiService from '../services/UserManagementApiService';
import {
  ORGANISATION_MODULE_REDUX_CONSTANTS,
  USER_MANAGEMENT_CLIENT_LIST_REDUX_CONSTANTS,
  USER_MANAGEMENT_COLUMN_LIST_REDUX_CONSTANTS,
  USER_MANAGEMENT_CRUD_REDUX_CONSTANTS,
  USER_MANAGEMENT_REDUX_CONSTANTS,
} from './UserManagementReduxConstants';
import { displayErrors } from '../../../helpers/ErrorNotifyHelper';
import {
  startLoaderButtonOnRequest,
  stopLoaderButtonOnSuccessOrFail,
} from '../../../common/LoaderButton/redux/LoaderButtonAction';

export const getUserManagementListByFilter = (params = { page: 1, limit: 15 }) => {
  return async dispatch => {
    try {
      dispatch({
        type: USER_MANAGEMENT_REDUX_CONSTANTS.FETCH_USER_MANAGEMENT_LIST_REQUEST,
      });
      const response = await UserManagementApiService.getAllUserListByFilter(params);
      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: USER_MANAGEMENT_REDUX_CONSTANTS.FETCH_USER_MANAGEMENT_LIST_SUCCESS,
          data: response.data.data,
        });
      }
    } catch (e) {
      dispatch({
        type: USER_MANAGEMENT_REDUX_CONSTANTS.FETCH_USER_MANAGEMENT_LIST_FAILURE,
      });
      displayErrors(e);
    }
  };
};

export const getAllUserPrivileges = () => {
  return async dispatch => {
    try {
      const response = await UserManagementApiService.getAllUserPrivileges();

      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: USER_MANAGEMENT_REDUX_CONSTANTS.PRIVILEGES.GET_ALL_USER_PRIVILEGES,
          data: response?.data?.data?.moduleAccess ?? [],
        });
      }
    } catch (e) {
      displayErrors(e);
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
        dispatch({
          type:
            USER_MANAGEMENT_COLUMN_LIST_REDUX_CONSTANTS.USER_MANAGEMENT_DEFAULT_COLUMN_LIST_ACTION,
          data: response.data.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const saveUserColumnListName = ({ userColumnNameList = {}, isReset = false }) => {
  return async dispatch => {
    try {
      startLoaderButtonOnRequest(`UserListColumn${isReset ? 'Reset' : 'Save'}ButtonLoaderAction`);
      let data = {
        isReset: true,
        columns: [],
      };
      if (!isReset) {
        const defaultColumns = userColumnNameList.defaultFields
          .filter(e => e.isChecked)
          .map(e => e.name);
        const customFields = userColumnNameList.customFields
          .filter(e => e.isChecked)
          .map(e => e.name);
        data = {
          isReset: false,
          columns: [...defaultColumns, ...customFields],
        };
        if (data.columns.length < 1) {
          errorNotification('Please select at least one column to continue.');
          stopLoaderButtonOnSuccessOrFail(
            `UserListColumn${isReset ? 'Reset' : 'Save'}ButtonLoaderAction`
          );
          throw Error();
        }
      }
      const response = await UserManagementApiService.updateUserColumnListName(data);
      if (response.data.status === 'SUCCESS') {
        dispatch({
          type:
            USER_MANAGEMENT_COLUMN_LIST_REDUX_CONSTANTS.USER_MANAGEMENT_DEFAULT_COLUMN_LIST_ACTION,
          data: userColumnNameList,
        });
        successNotification(response?.data?.message ?? 'Columns updated successfully.');
        stopLoaderButtonOnSuccessOrFail(
          `UserListColumn${isReset ? 'Reset' : 'Save'}ButtonLoaderAction`
        );
      }
    } catch (e) {
      stopLoaderButtonOnSuccessOrFail(
        `UserListColumn${isReset ? 'Reset' : 'Save'}ButtonLoaderAction`
      );
      displayErrors(e);
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
      startLoaderButtonOnRequest('viewUserPageLoaderAction');
      const response = await UserManagementApiService.getSelectedUserData(id);
      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: USER_MANAGEMENT_CRUD_REDUX_CONSTANTS.USER_MANAGEMENT_GET_USER_ACTION,
          data: response.data.data,
        });
        stopLoaderButtonOnSuccessOrFail('viewUserPageLoaderAction');
      }
    } catch (e) {
      stopLoaderButtonOnSuccessOrFail('viewUserPageLoaderAction');
      displayErrors(e);
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
      displayErrors(e);
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
      displayErrors(e);
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
      startLoaderButtonOnRequest('viewUserAddNewUserButtonLoaderAction');
      const finalData = {
        ...data,
        clientIds: data.clientIds ? data.clientIds.map(e => e.value) : [],
      };

      const response = await UserManagementApiService.addNewUser(finalData);

      if (response.data.status === 'SUCCESS') {
        successNotification('Added user successfully.');
        stopLoaderButtonOnSuccessOrFail('viewUserAddNewUserButtonLoaderAction');
        dispatch(getUserManagementListByFilter());
      }
    } catch (e) {
      stopLoaderButtonOnSuccessOrFail('viewUserAddNewUserButtonLoaderAction');
      displayErrors(e);
    }
  };
};

export const updateUserDetails = (id, data) => {
  return async () => {
    try {
      startLoaderButtonOnRequest('viewUserUpdateUserButtonLoaderAction');
      const finalData = {
        ...data,
        clientIds: data.clientIds ? data.clientIds.map(e => e.value) : [],
        _id: undefined,
        maxCreditLimit: data.maxCreditLimit ?? 0,
      };

      const response = await UserManagementApiService.updateUser(id, finalData);

      if (response.data.status === 'SUCCESS') {
        successNotification(response?.data?.message ?? 'User details updated successfully.');
        stopLoaderButtonOnSuccessOrFail('viewUserUpdateUserButtonLoaderAction');
      }
    } catch (e) {
      stopLoaderButtonOnSuccessOrFail('viewUserUpdateUserButtonLoaderAction');
      displayErrors(e);
    }
  };
};

export const deleteUserDetails = (id, params) => {
  return async dispatch => {
    try {
      startLoaderButtonOnRequest('viewUserDeleteUserButtonLoaderAction');
      const response = await UserManagementApiService.deleteUser(id);

      if (response.data.status === 'SUCCESS') {
        successNotification(response?.data?.message ?? 'User deleted successfully.');
        stopLoaderButtonOnSuccessOrFail('viewUserDeleteUserButtonLoaderAction');
        dispatch(getUserManagementListByFilter(params));
      }
    } catch (e) {
      stopLoaderButtonOnSuccessOrFail('viewUserDeleteUserButtonLoaderAction');
      displayErrors(e);
    }
  };
};

export const resetUserListPaginationData = (page, limit, pages, total) => {
  return async dispatch => {
    dispatch({
      type: USER_MANAGEMENT_REDUX_CONSTANTS.RESET_USERLIST_PAGINATION_DATA,
      page,
      limit,
      pages,
      total,
    });
  };
};
