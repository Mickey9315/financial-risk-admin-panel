import { combineReducers } from 'redux';
import { loggedUser } from '../screens/auth/login/redux/LoginReducer';
import {
  organizationModulesList,
  selectedUserData,
  userManagementClientList,
  userManagementColumnList,
  userManagementList,
  userPrivileges,
} from '../screens/Users/redux/UserManagementReducer';
import {
  clientManagement,
  clientManagementColumnList,
  clientManagementFilterList,
  syncClientWithCrm,
} from '../screens/Clients/redux/ClientReducer';
import { application } from '../screens/Application/redux/ApplicationReducer';
import { insurer } from '../screens/Insurer/redux/InsurerReducer';
import { loggedUserProfile } from '../common/Header/redux/HeaderReducer';
import { myWorkReducer } from '../screens/MyWork/redux/MyWorkReducer';
import { debtorsManagement } from '../screens/Debtors/redux/DebtorsReducer';

const rootReducer = combineReducers({
  loggedUser,
  userPrivileges,
  userManagementColumnList,
  userManagementList,
  clientManagement,
  selectedUserData,
  organizationModulesList,
  userManagementClientList,
  clientManagementColumnList,
  clientManagementFilterList,
  loggedUserProfile,
  syncClientWithCrm,
  application,
  insurer,
  debtorsManagement,
  myWorkReducer,
});
export default rootReducer;
