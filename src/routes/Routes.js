import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { useEffect } from 'react';
import LoginScreen from '../screens/auth/login/LoginScreen';
import ForgotPassword from '../screens/auth/forgotPassword/ForgotPassword';
import { saveTokenFromLocalStorageToSession } from '../helpers/LocalStorageHelper';
import ResetPassword from '../screens/auth/resetPassword/ResetPassword';
import VerifyOtp from '../screens/auth/otpScreen/VerifyOtp';
import { AllAuthenticatedRoutes, AuthenticatedRoute } from './AuthenticatedRoutes';
import ForbiddenAccessPage from '../common/ForbiddenAccessPage/ForbiddenAccessPage';
import SetPassword from '../screens/auth/setPassword/SetPassword';

function Routes() {
  useEffect(() => {
    saveTokenFromLocalStorageToSession();
  }, []);

  return (
    <Router>
      <Switch>
        <Route exact path="/login" component={LoginScreen} />
        <Route exact path="/forgot-password" component={ForgotPassword} />
        <Route exact path="/set-password" component={SetPassword} />
        <Route exact path="/reset-password" component={ResetPassword} />
        <Route exact path="/verify-otp" component={VerifyOtp} />
        <Route exact path="/forbidden-access" component={ForbiddenAccessPage} />
        <AuthenticatedRoute exact path="/" />
        <AllAuthenticatedRoutes />
      </Switch>
    </Router>
  );
}

export default Routes;
