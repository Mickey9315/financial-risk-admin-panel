/*
/!* eslint-disable no-case-declarations *!/
import { LOGIN_REDUX_CONSTANTS } from '../../auth/login/redux/LoginReduxConstants';
import { INSURER_REDUX_CONSTANTS } from './InsurerReduxConstants';

const initialInsurerListState = { docs: [], total: 0, limit: 0, page: 1, pages: 1 };

export const insurerManagementList = (state = initialInsurerListState, action) => {
  switch (action.type) {
    case INSURER_REDUX_CONSTANTS.INSURER_LIST_USER_ACTION:
      return action.data;

    case LOGIN_REDUX_CONSTANTS.LOGOUT_USER_ACTION:
      return null;

    default:
      return state;
  }
};
*/
