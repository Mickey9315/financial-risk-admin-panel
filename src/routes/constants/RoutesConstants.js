import LoginScreen from '../../screens/auth/login/LoginScreen';
import ForgotPassword from '../../screens/auth/forgotPassword/ForgotPassword';
import SetPassword from '../../screens/auth/setPassword/SetPassword';
import ResetPassword from '../../screens/auth/resetPassword/ResetPassword';
import VerifyOtp from '../../screens/auth/otpScreen/VerifyOtp';
import UserList from '../../screens/Users/UserList/UserList';
import AddUser from '../../screens/Users/AddUser/AddUser';
import ClientList from '../../screens/Clients/ClientList/ClientList';
import ViewClient from '../../screens/Clients/ViewClient/ViewClient';
import ViewInsurer from '../../screens/Insurer/ViewInsurer/ViewInsurer';
import InsurerList from '../../screens/Insurer/InsurerList/InsurerList';
// import ViewInsurer from '../../screens/Insurer/ViewInsurer/ViewInsurer';
import MyWork from '../../screens/MyWork/MyWork';
import Settings from '../../screens/Settings/Settings';
import DebtorsList from '../../screens/Debtors/DebtorsList/DebtorsList';
import ViewDebtor from '../../screens/Debtors/ViewDebtor/ViewDebtor';
import PageNotFound from '../../common/PageNotFound/PageNotFound';

import ForbiddenAccessPage from '../../common/ForbiddenAccessPage/ForbiddenAccessPage';
import ApplicationList from '../../screens/Application/ApplicationList/ApplicationList';
import GenerateApplication from '../../screens/Application/GenerateApplication/GenerateApplication';
import MyWorkAddTask from '../../screens/MyWork/MyWorkTasks/MyWorkAddTask/MyWorkAddTask';
import MyWorkEditTask from '../../screens/MyWork/MyWorkTasks/MyWorkEditTask/MyWorkEditTask';
import ViewApplication from '../../screens/Application/ViewApplication/ViewApplication';

export const ROUTES_CONSTANTS = [
  {
    path: '/login',
    component: LoginScreen,
  },
  {
    path: '/forgot-password',
    component: ForgotPassword,
  },
  {
    path: '/set-password',
    component: SetPassword,
  },
  {
    path: '/reset-password',
    component: ResetPassword,
  },
  {
    path: '/verify-otp',
    component: VerifyOtp,
  },
  {
    path: '/forbidden-access',
    component: ForbiddenAccessPage,
    escapeRedirect: true,
  },
  {
    path: '/',
    authenticated: true,
  },
  {
    path: '/dashboard',
    authenticated: true,
  },
  {
    path: '/my-work',
    component: MyWork,
    authenticated: true,
  },
  {
    path: '/my-work/add',
    component: MyWorkAddTask,
    authenticated: true,
  },
  {
    path: '/my-work/edit/:id',
    component: MyWorkEditTask,
    authenticated: true,
  },
  {
    path: '/applications',
    component: ApplicationList,
    authenticated: true,
  },
  {
    path: '/applications/application/:action/',
    component: GenerateApplication,
    authenticated: true,
  },
  {
    path: '/applications/detail/:action/:id',
    component: ViewApplication,
    authenticated: true,
  },
  {
    path: '/debtors',
    component: DebtorsList,
    authenticated: true,
  },
  {
    path: '/debtors/debtor/:action/:id',
    component: ViewDebtor,
    authenticated: true,
  },
  {
    path: '/claims',
    authenticated: true,
  },
  {
    path: '/over-dues',
    authenticated: true,
  },
  {
    path: '/reports',
    authenticated: true,
  },
  {
    path: '/settings',
    component: Settings,
    authenticated: true,
  },
  {
    path: '/users',
    component: UserList,
    authenticated: true,
  },
  {
    path: '/users/user/:action/:id',
    component: AddUser,
    authenticated: true,
  },
  {
    path: '/clients',
    component: ClientList,
    authenticated: true,
  },
  {
    path: '/clients/client/:action/:id',
    component: ViewClient,
    authenticated: true,
  },
  {
    path: '/insurer',
    component: InsurerList,
    authenticated: true,
  },
  {
    path: '/insurer/:action/:id',
    component: ViewInsurer,
    authenticated: true,
  },
  {
    path: '*',
    component: PageNotFound,
    escapeRedirect: true,
  },
];
