/* eslint-disable no-case-declarations */
import {
  ORGANISATION_MODULE_REDUX_CONSTANTS,
  USER_MANAGEMENT_CLIENT_LIST_REDUX_CONSTANTS,
  USER_MANAGEMENT_COLUMN_LIST_REDUX_CONSTANTS,
  USER_MANAGEMENT_CRUD_REDUX_CONSTANTS,
  USER_MANAGEMENT_REDUX_CONSTANTS,
} from './UserManagementReduxConstants';

const initialUserManagementListState = {
  docs: [],
  total: 1,
  limit: 15,
  page: 1,
  pages: 1,
  isLoading: true,
  viewAddedOrUpdatedUser: undefined,
};

const initialUserColumnManagementState = {
  userColumnNameList: {},
  userDefaultColumnNameList: {},
};

export const userManagementList = (state = initialUserManagementListState, action) => {
  switch (action.type) {
    case USER_MANAGEMENT_REDUX_CONSTANTS.FETCH_USER_MANAGEMENT_LIST_SUCCESS:
      return {
        ...state,
        ...action?.data,
        isLoading: false,
      };

    case USER_MANAGEMENT_REDUX_CONSTANTS.RESET_USERLIST_PAGINATION_DATA: {
      return {
        ...state,
        page: action?.page,
        total: action?.total,
        limit: action?.limit,
        pages: action?.pages,
        docs: [],
      };
    }
    case USER_MANAGEMENT_REDUX_CONSTANTS.RESET_USER_LIST_DATA: {
      return initialUserManagementListState;
    }

    case USER_MANAGEMENT_REDUX_CONSTANTS.USER_MANAGEMENT_GET_ADDED_USER_ID:
      return {
        ...state,
        viewAddedOrUpdatedUser: action?.data,
      };

    default:
      return state;
  }
};

export const userPrivileges = (state = [], action) => {
  switch (action.type) {
    case USER_MANAGEMENT_REDUX_CONSTANTS.PRIVILEGES.GET_ALL_USER_PRIVILEGES:
      return action?.data;
    default:
      return state;
  }
};

export const userManagementColumnList = (state = initialUserColumnManagementState, action) => {
  switch (action?.type) {
    case USER_MANAGEMENT_COLUMN_LIST_REDUX_CONSTANTS.USER_MANAGEMENT_COLUMN_LIST_ACTION:
      return {
        ...state,
        userColumnNameList: action?.data,
      };

    case USER_MANAGEMENT_COLUMN_LIST_REDUX_CONSTANTS.USER_MANAGEMENT_DEFAULT_COLUMN_LIST_ACTION:
      return {
        ...state,
        userDefaultColumnNameList: action?.data,
      };
    case USER_MANAGEMENT_COLUMN_LIST_REDUX_CONSTANTS.UPDATE_USER_MANAGEMENT_COLUMN_LIST_ACTION:
      const temp = {
        ...state?.userColumnNameList,
      };

      const { type, name, value } = action?.data;

      temp[`${type}`] = temp?.[`${type}`]?.map(e =>
        e.name === name
          ? {
              ...e,
              isChecked: value,
            }
          : e
      );

      return {
        ...state,
        userColumnNameList: temp,
      };
    default:
      return state;
  }
};

export const selectedUserData = (state = null, action) => {
  switch (action?.type) {
    case USER_MANAGEMENT_CRUD_REDUX_CONSTANTS.USER_MANAGEMENT_GET_USER_ACTION:
      return { ...action.data, duplicateModules: action?.data?.moduleAccess };
    case USER_MANAGEMENT_CRUD_REDUX_CONSTANTS.USER_MANAGEMENT_UPDATE_USER_ACTION:
      return {
        ...state,
        [`${action?.data?.name}`]: action?.data?.value,
      };
    case USER_MANAGEMENT_CRUD_REDUX_CONSTANTS.USER_MANAGEMENT_CHANGE_MANAGE_ACCESS_USER_ACTION:
      if (state && state?.moduleAccess) {
        let moduleAccess = [...state?.moduleAccess];
        moduleAccess = moduleAccess?.map(e => {
          if (e.name === action?.data?.name) {
            let accessTypes = [...e?.accessTypes];

            if (accessTypes?.includes(action?.data?.value)) {
              accessTypes = accessTypes?.filter(f => f !== action?.data?.value);
            } else {
              accessTypes.push(action?.data?.value);
            }
            return {
              ...e,
              accessTypes,
            };
          }
          return e;
        });
        return {
          ...state,
          moduleAccess,
        };
      }
      return {
        ...state,
        moduleAccess: [],
      };

      case USER_MANAGEMENT_CRUD_REDUX_CONSTANTS.USER_MANAGEMENT_UPDATE_DUPLICATE_MODULE_ACCESS:
        return { ...state, duplicateModules: action?.data };

    default:
      return state;
  }
};

export const organizationModulesList = (state = [], action) => {
  switch (action?.type) {
    case ORGANISATION_MODULE_REDUX_CONSTANTS.GET_ORGANISATION_MODULE_REDUX_ACTION:
      return action?.data;
    default:
      return state;
  }
};

const initialUserManagementClientListState = {
  riskAnalystList: [],
  serviceManagerList: [],
};

export const userManagementClientList = (state = initialUserManagementClientListState, action) => {
  switch (action?.type) {
    case USER_MANAGEMENT_CLIENT_LIST_REDUX_CONSTANTS.USER_MANAGEMENT_CLIENT_LIST_ACTION:
      return action?.data;
    default:
      return state;
  }
};
