import {combineReducers} from 'redux';
import {loggedUser} from '../screens/auth/login/redux/LoginReducer';
import {
  organizationModulesList,
  selectedUserData,
  userManagementClientList,
  userManagementColumnList,
  userManagementList,
} from '../screens/Users/redux/UserManagementReducer';
import {clientManagement} from '../screens/Clients/redux/ClientReducer';
import {insurerManagementList} from '../screens/Insurer/redux/InsurerReducer';

const rootReducer = combineReducers({
  loggedUser,
  userManagementColumnList,
  userManagementList,
  clientManagement,
  selectedUserData,
  organizationModulesList,
  userManagementClientList,
  insurerManagementList,
});
export default rootReducer;
