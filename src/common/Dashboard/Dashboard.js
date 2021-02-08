import React from 'react';
import './Dashboard.scss';
import PropTypes from 'prop-types';
import SideMenu from '../SideMenu/SideMenu';
import Header from '../Header/Header';

const Dashboard = props => {
  const { children } = props;
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

Dashboard.propTypes = {
  children: PropTypes.element,
};

Dashboard.defaultProps = {
  children: null,
};

export default Dashboard;
