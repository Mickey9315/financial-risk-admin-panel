import PropTypes from 'prop-types';
import React, { useRef } from 'react';
import { useOnClickOutside } from '../../hooks/UserClickOutsideHook';

const Drawer = props => {
  const { drawerState, closeDrawer, header, className, children, onDrawerScroll, ...restProps } =
    props;
  const drawerMenuRef = useRef();
  useOnClickOutside(drawerMenuRef, () => {
    if (drawerState) closeDrawer();
  });
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
            </span>
          </div>
          <div className="drawer-content" onScroll={onDrawerScroll} >
            {children}
          </div>
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
  onDrawerScroll: PropTypes.func,
};

Drawer.defaultProps = {
  header: null,
  className: '',
  drawerState: false,
  children: null,
  closeDrawer: () => {},
  onDrawerScroll: () => {},
};

export default Drawer;
