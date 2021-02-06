import React from 'react';
import './SideMenu.scss';
import { NavLink } from 'react-router-dom';
import logo from '../../assets/images/logo.svg';

const SideMenu = () => {
  return (
    <div className="side-menu-container">
      <div className="side-menu-logo">
        <img alt="TRAD" src={logo} />
      </div>
      <div className="menu-container">
        <NavLink className="menu" to="/dashboard" replace>
          <span className="material-icons">insert_chart</span>
          Dashboard
        </NavLink>
        <NavLink className="menu" to="/user" replace>
          <span className="material-icons">event_available</span>
          My Work
        </NavLink>
        <NavLink className="menu" to="/user" replace>
          <span className="material-icons">business_center</span>
          Application
        </NavLink>
        <NavLink className="menu" to="/user" replace>
          <span className="material-icons">people</span>
          Clients
        </NavLink>
        <NavLink className="menu" to="/user" replace>
          <span className="material-icons">account_circle</span>
          Debtors
        </NavLink>
        <NavLink className="menu" to="/user" replace>
          <span className="material-icons">pie_chart</span>
          Reports
        </NavLink>
        <NavLink className="menu" to="/user" replace>
          <span className="material-icons">text_snippet</span>
          Insurer
        </NavLink>
        <NavLink className="menu" to="/user" replace>
          <span className="material-icons">admin_panel_settings</span>
          Users
        </NavLink>
        <NavLink className="menu" to="/user" replace>
          <span className="material-icons">class</span>
          Claims
        </NavLink>
        <NavLink className="menu" to="/user" replace>
          <span className="material-icons">list_alt</span>
          Overdues
        </NavLink>
        <NavLink className="menu" to="/user" replace>
          <span className="material-icons">settings</span>
          Settings
        </NavLink>
        <NavLink className="menu" to="/user" replace>
          <span className="material-icons">fact_check</span>
          Audit Log
        </NavLink>
      </div>
    </div>
  );
};

export default SideMenu;
