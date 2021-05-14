import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import SideMenu from '../SideMenu/SideMenu';
import Header from '../Header/Header';

const Layout = props => {
  const { children } = props;
  const loggedUserDetails = useSelector(({ loggedUserProfile }) => loggedUserProfile);

  if (!loggedUserDetails?.email) {
    return children;
  }

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
