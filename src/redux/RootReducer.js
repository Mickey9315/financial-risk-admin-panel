import {combineReducers} from 'redux';
import {loggedUser} from '../screens/auth/login/redux/LoginReducer';
import {userManagementColumnList, userManagementList,} from '../screens/Users/redux/UserManagementReducer';
import {clientList} from '../screens/Clients/redux/ClientReducer';

const rootReducer = combineReducers({
  loggedUser,
  userManagementColumnList,
  userManagementList,
  clientList,
});
export default rootReducer;
