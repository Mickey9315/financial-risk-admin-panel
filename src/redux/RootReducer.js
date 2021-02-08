import { combineReducers } from 'redux';
import { loggedUser } from '../screens/auth/login/redux/LoginReducer';
import { userManagementList } from '../screens/Users/redux/UserManagementReducer';

const rootReducer = combineReducers({
  loggedUser,
  userManagementList,
});
export default rootReducer;
