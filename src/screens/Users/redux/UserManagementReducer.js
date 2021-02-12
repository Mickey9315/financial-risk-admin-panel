/* eslint-disable no-case-declarations */
import { LOGIN_REDUX_CONSTANTS } from '../../auth/login/redux/LoginReduxConstants';
import {
  ORGANISATION_MODULE_REDUX_CONSTANTS,
  USER_MANAGEMENT_COLUMN_LIST_REDUX_CONSTANTS,
  USER_MANAGEMENT_CRUD_REDUX_CONSTANTS,
  USER_MANAGEMENT_REDUX_CONSTANTS,
} from './UserManagementReduxConstants';

const initialUserManagementListState = { docs: [], total: 0, limit: 0, page: 1, pages: 1 };

export const userManagementList = (state = initialUserManagementListState, action) => {
  switch (action.type) {
    case USER_MANAGEMENT_REDUX_CONSTANTS.USER_MANAGEMENT_LIST_USER_ACTION:
      return action.data;

    case LOGIN_REDUX_CONSTANTS.LOGOUT_USER_ACTION:
      return null;

    default:
      return state;
  }
};

export const userManagementColumnList = (state = [], action) => {
  switch (action.type) {
    case USER_MANAGEMENT_COLUMN_LIST_REDUX_CONSTANTS.USER_MANAGEMENT_COLUMN_LIST_ACTION:
      return action.data;
    case USER_MANAGEMENT_COLUMN_LIST_REDUX_CONSTANTS.UPDATE_USER_MANAGEMENT_COLUMN_LIST_ACTION:
      const temp = {
        ...state,
      };

      const { type, name, value } = action.data;

      temp[`${type}`] = temp[`${type}`].map(e =>
        e.name === name
          ? {
              ...e,
              isChecked: value,
            }
          : e
      );

      return temp;

    case LOGIN_REDUX_CONSTANTS.LOGOUT_USER_ACTION:
      return null;

    default:
      return state;
  }
};

export const selectedUserData = (state = null, action) => {
  switch (action.type) {
    case USER_MANAGEMENT_CRUD_REDUX_CONSTANTS.USER_MANAGEMENT_GET_USER_ACTION:
      return action.data;
    case USER_MANAGEMENT_CRUD_REDUX_CONSTANTS.USER_MANAGEMENT_UPDATE_USER_ACTION:
      return {
        ...state,
        [`${action.data.name}`]: action.data.value,
      };

    case LOGIN_REDUX_CONSTANTS.LOGOUT_USER_ACTION:
      return null;

    default:
      return state;
  }
};

export const organizationModulesList = (state = [], action) => {
  switch (action.type) {
    case ORGANISATION_MODULE_REDUX_CONSTANTS.GET_ORGANISATION_MODULE_REDUX_ACTION:
      return action.data.filter(e => !e.isDefault);

    case LOGIN_REDUX_CONSTANTS.LOGOUT_USER_ACTION:
      return null;

    default:
      return state;
  }
};
