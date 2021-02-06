import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import LoginScreen from '../screens/auth/login/LoginScreen';
import ForgotPassword from '../screens/auth/forgotPassword/ForgotPassword';
import Dashboard from '../common/Dashboard/Dashboard';

function Routes() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Redirect to="/login" />
        </Route>
        <Route exact path="/login" component={LoginScreen} />
        <Route exact path="/forgot-password/:screenType" component={ForgotPassword} />
        <Route exact path="/dashboard" component={Dashboard} />
      </Switch>
    </Router>
  );
}

export default Routes;
