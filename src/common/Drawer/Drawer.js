import React, { useRef } from 'react';
import './Drawer.scss';
import PropTypes from 'prop-types';
import { useOnClickOutside } from '../../hooks/UserClickOutsideHook';

const Drawer = props => {
  const { drawerState, closeDrawer, header, className, children, ...restProps } = props;
  const drawerMenuRef = useRef();
  useOnClickOutside(drawerMenuRef, () => closeDrawer());

  const drawerClasses = `drawer-container ${drawerState ? 'drawer-opened' : ''} ${className}`;

  return (
    <>
      <div className={drawerState ? 'drawer-overlay' : ''} />
      <div className={drawerClasses} {...restProps} ref={drawerMenuRef}>
        <div className="drawer-wrapper">
          <div className="drawer-header-container">
            {header}
            <span
              className="material-icons-round close-drawer"
              title="Close drawer"
              onClick={closeDrawer}
            >
              close
            </span>{' '}
          </div>
          <div className="drawer-content">{children}</div>
        </div>
      </div>
    </>
  );
};

Drawer.propTypes = {
  header: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  className: PropTypes.string,
  children: PropTypes.element,
  drawerState: PropTypes.bool,
  closeDrawer: PropTypes.func,
};

Drawer.defaultProps = {
  header: null,
  className: '',
  drawerState: false,
  children: null,
  closeDrawer: () => {},
};

export default Drawer;
