import { combineReducers } from 'redux';
import { loggedUser } from '../screens/auth/login/redux/LoginReducer';
import {
  organizationModulesList,
  selectedUserData,
  userManagementClientList,
  userManagementColumnList,
  userManagementList,
} from '../screens/Users/redux/UserManagementReducer';
import { clientList } from '../screens/Clients/redux/ClientReducer';

const rootReducer = combineReducers({
  loggedUser,
  userManagementColumnList,
  userManagementList,
  clientList,
  selectedUserData,
  organizationModulesList,
  userManagementClientList,
});
export default rootReducer;
