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
import { editProfile } from '../common/Header/redux/HeaderReducer';
import { loggedUserProfile, profilePictureReducer } from '../common/Header/redux/HeaderReducer';

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
  editProfile,
  profilePictureReducer,
});
export default rootReducer;
