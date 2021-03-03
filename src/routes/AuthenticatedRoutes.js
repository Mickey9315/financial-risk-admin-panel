import { Redirect, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import { getAuthTokenLocalStorage } from '../helpers/LocalStorageHelper';
import Dashboard from '../common/Dashboard/Dashboard';
import UserList from '../screens/Users/UserList/UserList';
import AddUser from '../screens/Users/AddUser/AddUser';
import ClientList from '../screens/Clients/ClientList/ClientList';
import ViewClient from '../screens/Clients/ViewClient/ViewClient';
import ViewInsurer from '../screens/Insurer/ViewInsurer/ViewInsurer';
import ApplicationList from '../screens/Application/ApplicationList/ApplicationList';

export const AuthenticatedRoute = ({ component, ...options }) => {
  const isLoggedIn = getAuthTokenLocalStorage();

  if (!isLoggedIn) {
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
      <AuthenticatedRoute exact path="/my-work" component={null} />
      <AuthenticatedRoute exact path="/application" component={ApplicationList} />
      <AuthenticatedRoute exact path="/debtors" component={null} />
      <AuthenticatedRoute exact path="/claims" component={null} />
      <AuthenticatedRoute exact path="/over-dues" component={null} />
      <AuthenticatedRoute exact path="/insurer" component={null} />
      <AuthenticatedRoute exact path="/reports" component={null} />
      <AuthenticatedRoute exact path="/settings" component={null} />
      <AuthenticatedRoute exact path="/users" component={UserList} />
      <AuthenticatedRoute exact path="/users/user/:action/:id" component={AddUser} />
      <AuthenticatedRoute exact path="/clients" component={ClientList} />
      <AuthenticatedRoute exact path="/clients/client/:action/:id" component={ViewClient} />
      <AuthenticatedRoute exact path="/insurer" component={ViewInsurer} />
    </Dashboard>
  );
};
