import React from 'react';
import './SideMenu.scss';
import { NavLink } from 'react-router-dom';
import logo from '../../assets/images/logo.svg';
import { SIDEBAR_URLS } from '../../constants/SidebarConstants';

const SideMenu = () => {
  return (
    <div className="side-menu-container">
      <div className="side-menu-logo">
        <img alt="TRAD" src={logo} />
      </div>
      <div className="menu-container">
        {SIDEBAR_URLS.map(item => (
          <NavLink className="menu" to={item.url} replace>
            <span className="material-icons-round">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default SideMenu;

// todo remove after sidebar constants prepared
/*
<NavLink className="menu" to="/application" replace>
          <span className="material-icons-round">business_center</span>
          Application
        </NavLink>
        <NavLink className="menu" to="/clients" replace>
          <span className="material-icons-round">people</span>
          Clients
        </NavLink>
        <NavLink className="menu" to="/debtors" replace>
          <span className="material-icons-round">account_circle</span>
          Debtors
        </NavLink>
        <NavLink className="menu" to="/reports" replace>
          <span className="material-icons-round">pie_chart</span>
          Reports
        </NavLink>
        <NavLink className="menu" to="/insurer" replace>
          <span className="material-icons-round">text_snippet</span>
          Insurer
        </NavLink>
        <NavLink className="menu" to="/users" replace>
          <span className="material-icons-round">admin_panel_settings</span>
          Users
        </NavLink>
        <NavLink className="menu" to="/claims" replace>
          <span className="material-icons-round">class</span>
          Claims
        </NavLink>
        <NavLink className="menu" to="/over-dues" replace>
          <span className="material-icons-round">list_alt</span>
          Overdues
        </NavLink>
        <NavLink className="menu" to="/settings" replace>
          <span className="material-icons-round">settings</span>
          Settings
        </NavLink>
        <NavLink className="menu" to="/audit-log" replace>
          <span className="material-icons-round">fact_check</span>
          Audit Log
        </NavLink>
* */
