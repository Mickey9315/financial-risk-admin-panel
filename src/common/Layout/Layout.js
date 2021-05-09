import React, { useEffect } from 'react';
import './Layout.scss';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import SideMenu from '../SideMenu/SideMenu';
import Header from '../Header/Header';
import { getAllUserPrivileges } from '../../screens/Users/redux/UserManagementAction';
import { SESSION_VARIABLES } from '../../constants/SessionStorage';

const Layout = props => {
  const { children } = props;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllUserPrivileges());
  }, [SESSION_VARIABLES.USER_TOKEN]);

  return (
    <div className="dashboard-container">
      <SideMenu />
      <div className="right-side-container">
        <Header />
        <div className="page-container">{children}</div>
      </div>
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node,
};

Layout.defaultProps = {
  children: null,
};

export default Layout;
