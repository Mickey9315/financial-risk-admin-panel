import { Redirect, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import Dashboard from '../common/Dashboard/Dashboard';
import UserList from '../screens/Users/UserList/UserList';
import AddUser from '../screens/Users/AddUser/AddUser';
import ClientList from '../screens/Clients/ClientList/ClientList';
import ViewClient from '../screens/Clients/ViewClient/ViewClient';
import ViewInsurer from '../screens/Insurer/ViewInsurer/ViewInsurer';
import ApplicationList from '../screens/Application/ApplicationList/ApplicationList';
import InsurerList from '../screens/Insurer/InsurerList/InsurerList';
import GenerateApplication from '../screens/Application/GenerateApplication/GenerateApplication';
// import ViewInsurer from '../screens/Insurer/ViewInsurer/ViewInsurer';
import MyWork from '../screens/MyWork/MyWork';
import MyWorkAddTask from '../screens/MyWork/MyWorkTasks/MyWorkAddTask/MyWorkAddTask';
import Settings from '../screens/Settings/Settings';
import DebtorsList from '../screens/Debtors/DebtorsList/DebtorsList';
import ViewDebtor from '../screens/Debtors/ViewDebtor/ViewDebtor';
import MyWorkEditTask from '../screens/MyWork/MyWorkTasks/MyWorkEditTask/MyWorkEditTask';
import ViewApplication from '../screens/Application/ViewApplication/ViewApplication';

export const AuthenticatedRoute = ({ component, ...options }) => {
  const loggedUserDetails = useSelector(({ loggedUserProfile }) => loggedUserProfile);

  if (!loggedUserDetails.email) {
    return (
      <Route {...options}>
        <Redirect to="/login" />
      </Route>
    );
  }

  if (!component) {
    return (
      <Route {...options}>
        <Redirect to="/dashboard" />
      </Route>
    );
  }

  return <Route {...options} component={component} />;
};
AuthenticatedRoute.propTypes = {
  component: PropTypes.func,
};
AuthenticatedRoute.defaultProps = {
  component: null,
};

export const AllAuthenticatedRoutes = () => {
  return (
    <Dashboard>
      <AuthenticatedRoute exact path="/dashboard" component={null} />
      <AuthenticatedRoute exact path="/my-work" component={MyWork} />
      <AuthenticatedRoute exact path="/my-work/add" component={MyWorkAddTask} />
      <AuthenticatedRoute exact path="/my-work/edit/:id" component={MyWorkEditTask} />
      <AuthenticatedRoute exact path="/applications" component={ApplicationList} />
      <AuthenticatedRoute
        exact
        path="/applications/application/:action/"
        component={GenerateApplication}
      />
      <AuthenticatedRoute
        exact
        path="/applications/detail/:action/:id"
        component={ViewApplication}
      />
      <AuthenticatedRoute exact path="/debtors" component={DebtorsList} />
      <AuthenticatedRoute exact path="/debtors/debtor/:action/:id" component={ViewDebtor} />
      <AuthenticatedRoute exact path="/claims" component={null} />
      <AuthenticatedRoute exact path="/over-dues" component={null} />
      <AuthenticatedRoute exact path="/reports" component={null} />
      <AuthenticatedRoute exact path="/settings" component={Settings} />
      <AuthenticatedRoute exact path="/users" component={UserList} />
      <AuthenticatedRoute exact path="/users/user/:action/:id" component={AddUser} />
      <AuthenticatedRoute exact path="/clients" component={ClientList} />
      <AuthenticatedRoute exact path="/clients/client/:action/:id" component={ViewClient} />
      <AuthenticatedRoute exact path="/insurer" component={InsurerList} />
      <AuthenticatedRoute exact path="/insurer/:action/:id" component={ViewInsurer} />
    </Dashboard>
  );
};
