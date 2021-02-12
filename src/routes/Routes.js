import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import { useEffect } from 'react';
import LoginScreen from '../screens/auth/login/LoginScreen';
import ForgotPassword from '../screens/auth/forgotPassword/ForgotPassword';
import Dashboard from '../common/Dashboard/Dashboard';
import { saveTokenFromLocalStorageToSession } from '../helpers/LocalStorageHelper';
import ResetPassword from '../screens/auth/resetPassword/ResetPassword';
import VerifyOtp from '../screens/auth/otpScreen/VerifyOtp';
import UserList from '../screens/Users/UserList/UserList';
import AddUser from '../screens/Users/AddUser/AddUser';
import ClientList from '../screens/Clients/ClientList/ClientList';
import ViewClient from '../screens/Clients/ViewClient/ViewClient';

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
        <Route exact path="/verify-otp" component={VerifyOtp} />
        <Route exact path="/users" component={UserList} />
        <Route exact path="/addUser/:id" component={AddUser} />
        <Route exact path="/clients" component={ClientList} />
        <Route exact path="/viewClient" component={ViewClient} />
        {/* </> */}
        {/* )} */}
      </Switch>
    </Router>
  );
}

export default Routes;
