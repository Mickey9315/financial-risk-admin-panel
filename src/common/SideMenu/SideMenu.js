import React, { useEffect, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import logo from '../../assets/images/logo.svg';
import { SIDEBAR_URLS } from '../../constants/SidebarConstants';
import { getAllUserPrivileges } from '../../screens/Users/redux/UserManagementAction';
import { SESSION_VARIABLES } from '../../constants/SessionStorage';

const SideMenu = () => {
  const dispatch = useDispatch();

  const userPrivilegesData = useSelector(({ userPrivileges }) => userPrivileges);

  const userAccessibleMenu = useMemo(() => {
    let accessibleModules =
      userPrivilegesData?.filter(module => module.accessTypes.length > 0) ?? [];
    accessibleModules =
      SIDEBAR_URLS.filter(e =>
        accessibleModules?.some(f => e.name === f.name || e.name === 'myWork')
      ) ?? [];

    return accessibleModules;
  }, [userPrivilegesData]);

  useEffect(() => {
    dispatch(getAllUserPrivileges());
  }, [SESSION_VARIABLES.USER_TOKEN]);

  return (
    <div className="side-menu-container">
      <div className="side-menu-logo">
        <img alt="TRAD" src={logo} />
      </div>
      <div className="menu-container">
        {userAccessibleMenu.map(item => (
          <NavLink key={item.url} className="menu" to={item.url} replace>
            <span className="material-icons-round">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default SideMenu;
