import React from 'react';
import './Drawer.scss';
import PropTypes from 'prop-types';

const Drawer = props => {
  const { drawerState, header, className, children, ...restProps } = props;
  const drawerClasses = `drawer-container ${drawerState && 'drawer-opened'} ${className}`;
  return (
    <div className={drawerState && 'drawer-overlay'}>
      <div className={drawerClasses} {...restProps}>
        <div className="drawer-wrapper">
          <div className="drawer-header-container">
            {header}
            <span className="material-icons-round" title="Close drawer">
              close
            </span>{' '}
          </div>
          <div className="drawer-content">{children}</div>
        </div>
      </div>
    </div>
  );
};

Drawer.propTypes = {
  header: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.element,
  drawerState: PropTypes.bool,
};

Drawer.defaultProps = {
  header: '',
  className: '',
  drawerState: false,
  children: null,
};

export default Drawer;
