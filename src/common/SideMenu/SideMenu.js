import React, { useMemo } from 'react';
import './SideMenu.scss';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import logo from '../../assets/images/logo.svg';
import { SIDEBAR_URLS } from '../../constants/SidebarConstants';

const SideMenu = () => {
  const userPrivilegesData = useSelector(({ userPrivileges }) => userPrivileges);

  const userAccessibleMenu = useMemo(() => {
    let accessibleModules = userPrivilegesData.filter(module => module.accessTypes.length > 0);
    accessibleModules = SIDEBAR_URLS.filter(e => accessibleModules.some(f => e.name === f.name));

    return accessibleModules;
  }, [userPrivilegesData]);

  return (
    <div className="side-menu-container">
      <div className="side-menu-logo">
        <img alt="TRAD" src={logo} />
      </div>
      <div className="menu-container">
        {userAccessibleMenu.map(item => (
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
