import { LOGIN_REDUX_CONSTANTS } from '../../auth/login/redux/LoginReduxConstants';
import { CLIENT_REDUX_CONSTANTS } from './ClientReduxConstants';

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

    case LOGIN_REDUX_CONSTANTS.LOGOUT_USER_ACTION:
      return null;

    default:
      return state;
  }
};
