import { lazy } from 'react';

const LoginScreen = lazy(() => import('../../screens/auth/login/LoginScreen'));
const ForgotPassword = lazy(() => import('../../screens/auth/forgotPassword/ForgotPassword'));
const SetPassword = lazy(() => import('../../screens/auth/setPassword/SetPassword'));
const ResetPassword = lazy(() => import('../../screens/auth/resetPassword/ResetPassword'));
const VerifyOtp = lazy(() => import('../../screens/auth/otpScreen/VerifyOtp'));
const ForbiddenAccessPage = lazy(() =>
  import('../../common/ForbiddenAccessPage/ForbiddenAccessPage')
);
const UserList = lazy(() => import('../../screens/Users/UserList/UserList'));
const AddUser = lazy(() => import('../../screens/Users/AddUser/AddUser'));
const ClientList = lazy(() => import('../../screens/Clients/ClientList/ClientList'));
const ViewClient = lazy(() => import('../../screens/Clients/ViewClient/ViewClient'));
const ViewInsurer = lazy(() => import('../../screens/Insurer/ViewInsurer/ViewInsurer'));
const ApplicationList = lazy(() =>
  import('../../screens/Application/ApplicationList/ApplicationList')
);
const InsurerList = lazy(() => import('../../screens/Insurer/InsurerList/InsurerList'));
const GenerateApplication = lazy(() =>
  import('../../screens/Application/GenerateApplication/GenerateApplication')
);
// const ViewInsurer = lazy(() => import('../../screens/Insurer/ViewInsurer/ViewInsurer'));
const MyWork = lazy(() => import('../../screens/MyWork/MyWork'));
const MyWorkAddTask = lazy(() =>
  import('../../screens/MyWork/MyWorkTasks/MyWorkAddTask/MyWorkAddTask')
);
const Settings = lazy(() => import('../../screens/Settings/Settings'));
const DebtorsList = lazy(() => import('../../screens/Debtors/DebtorsList/DebtorsList'));
const ViewDebtor = lazy(() => import('../../screens/Debtors/ViewDebtor/ViewDebtor'));
const MyWorkEditTask = lazy(() =>
  import('../../screens/MyWork/MyWorkTasks/MyWorkEditTask/MyWorkEditTask')
);
const ViewApplication = lazy(() =>
  import('../../screens/Application/ViewApplication/ViewApplication')
);
const PageNotFound = lazy(() => import('../../common/PageNotFound/PageNotFound'));

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
  },
];
