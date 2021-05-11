import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { useOnClickOutside } from '../../hooks/UserClickOutsideHook';

const menuRoot = document.getElementById('menu-root');

const DropdownMenu = props => {
  const { children, toggleMenu, menuClass, ...restProps } = props;
  const dropdownClass = `dropdown-menu ${menuClass}`;
  const actionMenuRef = useRef();
  useOnClickOutside(actionMenuRef, () => toggleMenu(false));

  return ReactDOM.createPortal(
    <div className="dropdown-menu-overlay">
      <div className={dropdownClass} ref={actionMenuRef} {...restProps}>
        {children}
      </div>
    </div>,
    menuRoot
  );
};

DropdownMenu.propTypes = {
  children: PropTypes.element,
  toggleMenu: PropTypes.func,
  menuClass: PropTypes.string,
};

DropdownMenu.defaultProps = {
  children: null,
  toggleMenu: () => {},
  menuClass: '',
};

export default DropdownMenu;
