/* eslint-disable no-case-declarations */
import { LOGIN_REDUX_CONSTANTS } from '../../auth/login/redux/LoginReduxConstants';
import {
  CLIENT_MANAGEMENT_COLUMN_LIST_REDUX_CONSTANTS,
  CLIENT_REDUX_CONSTANTS,
} from './ClientReduxConstants';

const initialClientListState = {
  clientList: { docs: [], total: 0, limit: 0, page: 1, pages: 1 },
  selectedClient: null,
  contact: {
    contactList: { docs: [], total: 0, limit: 0, page: 1, pages: 1 },
    columnList: { docs: [], total: 0, limit: 0, page: 1, pages: 1 },
  },
};

export const clientManagement = (state = initialClientListState, action) => {
  switch (action.type) {
    case CLIENT_REDUX_CONSTANTS.CLIENT_LIST_USER_ACTION:
      return {
        ...state,
        clientList: action.data,
      };

    case CLIENT_REDUX_CONSTANTS.SELECTED_CLIENT_DATA:
      return {
        ...state,
        selectedClient: action.data,
      };

    case CLIENT_REDUX_CONSTANTS.CONTACT.CLIENT_CONTACT_LIST_USER_ACTION:
      return {
        ...state,
        contact: {
          ...state.contact,
          contactList: action.data,
        },
      };

    case CLIENT_REDUX_CONSTANTS.CONTACT.CLIENT_CONTACT_COLUMN_LIST_USER_ACTION:
      return {
        ...state,
        contact: {
          ...state.contact,
          columnList: action.data,
        },
      };

    case CLIENT_REDUX_CONSTANTS.CONTACT.UPDATE_CLIENT_CONTACT_COLUMN_LIST_ACTION:
      const columnList = {
        ...state.contact.columnList,
      };

      const { type, name, value } = action.data;

      columnList[`${type}`] = columnList[`${type}`].map(e =>
        e.name === name
          ? {
              ...e,
              isChecked: value,
            }
          : e
      );
      return {
        ...state,
        contact: {
          ...state.contact,
          columnList,
        },
      };

    case LOGIN_REDUX_CONSTANTS.LOGOUT_USER_ACTION:
      return null;

    default:
      return state;
  }
};

export const clientManagementColumnList = (state = [], action) => {
  switch (action.type) {
    case CLIENT_MANAGEMENT_COLUMN_LIST_REDUX_CONSTANTS.CLIENT_MANAGEMENT_COLUMN_LIST_ACTION:
      return action.data;
    case CLIENT_MANAGEMENT_COLUMN_LIST_REDUX_CONSTANTS.UPDATE_CLIENT_MANAGEMENT_COLUMN_LIST_ACTION:
      // eslint-disable-next-line no-case-declarations
      const temp = {
        ...state,
      };

      // eslint-disable-next-line no-case-declarations
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
