import {combineReducers} from 'redux';
import {loggedUser} from '../screens/auth/login/redux/LoginReducer';
import {
  organizationModulesList,
  selectedUserData,
  userManagementClientList,
  userManagementColumnList,
  userManagementList,
} from '../screens/Users/redux/UserManagementReducer';
import {clientManagement, clientManagementColumnList,} from '../screens/Clients/redux/ClientReducer';

const rootReducer = combineReducers({
  loggedUser,
  userManagementColumnList,
  userManagementList,
  clientManagement,
  selectedUserData,
  organizationModulesList,
  userManagementClientList,
  clientManagementColumnList,
});
export default rootReducer;
