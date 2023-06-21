import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import storageSession from 'redux-persist/lib/storage/session';
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
import {
  globalSearchReducer,
  headerNotificationReducer,
  loggedUserProfile,
} from '../common/Header/redux/HeaderReducer';
import { myWorkReducer } from '../screens/MyWork/redux/MyWorkReducer';
import { alerts, alertAllFilters } from '../screens/Alerts/redux/AlertsReducer';
import { debtorsManagement } from '../screens/Debtors/redux/DebtorsReducer';
import { settingReducer } from '../screens/Settings/redux/SettingReducer';
import { LOGIN_REDUX_CONSTANTS } from '../screens/auth/login/redux/LoginReduxConstants';
import { clearAuthToken } from '../helpers/LocalStorageHelper';
import { generalLoaderReducer } from '../common/GeneralLoader/redux/GeneralLoaderReducer';
import { dashboard } from '../screens/Dashboard/redux/DashboardReducer';
import { overdue } from '../screens/Overdues/redux/OverduesReducer';
import { claims } from '../screens/Claims/redux/ClaimsReducer';
import { reports } from '../screens/Reports/redux/ReportsReducer';
import { listFilterReducer } from '../common/ListFilters/redux/ListFiltersReducer';
import { reportAllFilters } from '../screens/Reports/redux/reportFilterReducer';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['loggedUserProfile'],
};

const filterPersistConfig = {
  key: 'allFilters',
  storage: storageSession,
};

const reportFilterPersistConfig = {
  key: 'reportFilters',
  storage: storageSession,
};

const appReducer = combineReducers({
  dashboard,
  loggedUserProfile,
  userPrivileges,
  userManagementColumnList,
  userManagementList,
  clientManagement,
  selectedUserData,
  organizationModulesList,
  userManagementClientList,
  clientManagementColumnList,
  clientManagementFilterList,
  syncClientWithCrm,
  application,
  alerts,
  alertAllFilters,
  insurer,
  debtorsManagement,
  myWorkReducer,
  settingReducer,
  generalLoaderReducer,
  headerNotificationReducer,
  globalSearchReducer,
  overdue,
  claims,
  reports,
  reportAllFilters: persistReducer(reportFilterPersistConfig, reportAllFilters),
  listFilterReducer: persistReducer(filterPersistConfig, listFilterReducer),
});

const rootReducer = (state, action) => {
  if (action.type === LOGIN_REDUX_CONSTANTS.LOGOUT_USER_ACTION) {
    clearAuthToken();
    const emptyState = {};
    Object.keys(state).forEach(key => {
      if (key !== 'listFilterReducer' || key !== 'reportAllFilters') {
        emptyState[key] = null;
      }
    });
    return emptyState;
  }

  return appReducer(state, action);
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default persistedReducer;
