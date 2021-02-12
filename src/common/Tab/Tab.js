import React from 'react';
import PropTypes from 'prop-types';
import './Tab.scss';

const Tab = props => {
  const { tabs, className, activeTabIndex, tabActive, ...restProps } = props;
  const tabClass = `tab-container ${className}`;

  return (
    <div className={tabClass} {...restProps}>
      {tabs.length > 0 &&
        tabs.map((e, index) => (
          <div
            className={`tab ${activeTabIndex === index && 'active-tab'}`}
            onClick={() => tabActive(index)}
          >
            {e}
          </div>
        ))}
    </div>
  );
};

Tab.propTypes = {
  tabs: PropTypes.array.isRequired,
  activeTabIndex: PropTypes.number,
  tabActive: PropTypes.func,
  className: PropTypes.string,
};

Tab.defaultProps = {
  className: '',
  activeTabIndex: 0,
  tabActive: '',
};

export default Tab;
