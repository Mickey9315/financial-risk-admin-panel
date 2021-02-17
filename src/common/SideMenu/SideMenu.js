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
