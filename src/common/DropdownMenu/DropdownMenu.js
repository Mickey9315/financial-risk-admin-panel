import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import './DropdownMenu.scss';
import { useOnClickOutside } from '../../hooks/UserClickOutsideHook';

const menuRoot = document.getElementById('menu-root');

const DropdownMenu = props => {
  const { children, toggleMenu, ...restProps } = props;
  const actionMenuRef = useRef();
  useOnClickOutside(actionMenuRef, () => toggleMenu(false));

  return ReactDOM.createPortal(
    <div className="dropdown-menu-overlay">
      <div className="dropdown-menu" ref={actionMenuRef} {...restProps}>
        {children}
      </div>
    </div>,
    menuRoot
  );
};

DropdownMenu.propTypes = {
  children: PropTypes.element,
  toggleMenu: PropTypes.func,
};

DropdownMenu.defaultProps = {
  children: null,
  toggleMenu: () => {},
};

export default DropdownMenu;
