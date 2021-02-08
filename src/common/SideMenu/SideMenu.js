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
          <span className="material-icons-round">insert_chart</span>
          Dashboard
        </NavLink>
        <NavLink className="menu" to="/user" replace>
          <span className="material-icons-round">event_available</span>
          My Work
        </NavLink>
        <NavLink className="menu" to="/user" replace>
          <span className="material-icons-round">business_center</span>
          Application
        </NavLink>
        <NavLink className="menu" to="/user" replace>
          <span className="material-icons-round">people</span>
          Clients
        </NavLink>
        <NavLink className="menu" to="/user" replace>
          <span className="material-icons-round">account_circle</span>
          Debtors
        </NavLink>
        <NavLink className="menu" to="/user" replace>
          <span className="material-icons-round">pie_chart</span>
          Reports
        </NavLink>
        <NavLink className="menu" to="/user" replace>
          <span className="material-icons-round">text_snippet</span>
          Insurer
        </NavLink>
        <NavLink className="menu" to="/users" replace>
          <span className="material-icons-round">admin_panel_settings</span>
          Users
        </NavLink>
        <NavLink className="menu" to="/user" replace>
          <span className="material-icons-round">class</span>
          Claims
        </NavLink>
        <NavLink className="menu" to="/user" replace>
          <span className="material-icons-round">list_alt</span>
          Overdues
        </NavLink>
        <NavLink className="menu" to="/user" replace>
          <span className="material-icons-round">settings</span>
          Settings
        </NavLink>
        <NavLink className="menu" to="/user" replace>
          <span className="material-icons-round">fact_check</span>
          Audit Log
        </NavLink>
      </div>
    </div>
  );
};

export default SideMenu;
