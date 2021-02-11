import { combineReducers } from 'redux';
import { loggedUser } from '../screens/auth/login/redux/LoginReducer';
import {
  userManagementColumnList,
  userManagementList,
} from '../screens/Users/redux/UserManagementReducer';

const rootReducer = combineReducers({
  loggedUser,
  userManagementColumnList,
  userManagementList,
});
export default rootReducer;
