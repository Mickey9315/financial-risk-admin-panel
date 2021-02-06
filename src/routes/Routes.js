import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import { useEffect } from 'react';
import LoginScreen from '../screens/auth/login/LoginScreen';
import ForgotPassword from '../screens/auth/forgotPassword/ForgotPassword';
import Dashboard from '../common/Dashboard/Dashboard';
import { saveTokenFromLocalStorageToSession } from '../helpers/LocalStorageHelper';
import ResetPassword from '../screens/auth/resetPassword/ResetPassword';
import OtpScreen from '../screens/auth/otpScreen/OtpScreen';

function Routes() {
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  //
  useEffect(() => {
    saveTokenFromLocalStorageToSession();
    //   if (SESSION_STORAGE.USER_TOKEN) {
    //     setIsLoggedIn(true);
    //   }
  }, []);

  return (
    <Router>
      <Switch>
        {/* {isLoggedIn ? ( */}
        {/*  <> */}
        {/*  </> */}
        {/* ) : ( */}
        {/*  <> */}
        <Route exact path="/dashboard" component={Dashboard} />
        <Route exact path="/">
          <Redirect to="/login" />
        </Route>
        <Route exact path="/login" component={LoginScreen} />
        <Route exact path="/forgot-password" component={ForgotPassword} />
        <Route exact path="/reset-password" component={ResetPassword} />
        <Route exact path="/verify-otp" component={OtpScreen} />
        {/* </> */}
        {/* )} */}
      </Switch>
    </Router>
  );
}

export default Routes;
