import { Redirect, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import { getAuthTokenLocalStorage } from '../helpers/LocalStorageHelper';
import LoginScreen from '../screens/auth/login/LoginScreen';
import Dashboard from '../common/Dashboard/Dashboard';
import UserList from '../screens/Users/UserList/UserList';
import AddUser from '../screens/Users/AddUser/AddUser';
import ClientList from '../screens/Clients/ClientList/ClientList';
import ViewClient from '../screens/Clients/ViewClient/ViewClient';

export const AuthenticatedRoute = ({ component, ...options }) => {
  const isLoggedIn = getAuthTokenLocalStorage();

  const finalComponent = isLoggedIn ? component : LoginScreen;
  if (options.path === '/' && isLoggedIn) {
    return (
      <Route {...options}>
        {' '}
        <Redirect to="/home" />
      </Route>
    );
  }
  return <Route {...options} component={finalComponent} />;
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
      <AuthenticatedRoute exact path="/users" component={UserList} />
      <AuthenticatedRoute exact path="/users/user/:action/:id" component={AddUser} />
      <AuthenticatedRoute exact path="/clients" component={ClientList} />
      <AuthenticatedRoute exact path="/viewClient" component={ViewClient} />
    </Dashboard>
  );
};
