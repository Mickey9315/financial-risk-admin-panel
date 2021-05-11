import React from 'react';
import PropTypes from 'prop-types';

const Tab = props => {
  const { tabs, className, activeTabIndex, tabActive, ...restProps } = props;
  const tabClass = `tab-container ${className}`;

  return (
    <div className={tabClass} {...restProps}>
      {tabs.length > 0 &&
        tabs.map((tab, index) => (
          <div
            key={index.toString()}
            className={`tab ${activeTabIndex === index && 'active-tab'}`}
            onClick={() => tabActive(index)}
          >
            {tab}
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
