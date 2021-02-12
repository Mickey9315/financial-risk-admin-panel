import { LOGIN_REDUX_CONSTANTS } from '../../auth/login/redux/LoginReduxConstants';
import { CLIENT_REDUX_CONSTANTS } from './ClientReduxConstants';

const initialClientListState = { docs: [], total: 0, limit: 0, page: 1, pages: 1 };

export const clientList = (state = initialClientListState, action) => {
  switch (action.type) {
    case CLIENT_REDUX_CONSTANTS.CLIENT_LIST_USER_ACTION:
      return action.data;

    case LOGIN_REDUX_CONSTANTS.LOGOUT_USER_ACTION:
      return null;

    default:
      return state;
  }
};
