import React, { useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { useWindowResizeGetElementWidth } from '../../hooks/OnWindowResizeGetElementWidthHook';

const Tab = props => {
  const tabRef = useRef(null);
  const prevPaddle = useRef(null);
  const nextPaddle = useRef(null);
  const { tabs, className, activeTabIndex, tabActive, ...restProps } = props;
  const tabClass = `tab-wrapper ${className}`;
  const tabContainer = tabRef?.current;
  const [tabContentWidth, tabTotalWidth] = useWindowResizeGetElementWidth(tabContainer);
  const isTabOverflow = tabContentWidth > tabTotalWidth;
  const tabInvisiblePart = tabContentWidth - tabTotalWidth;
  const onPrevClicked = useCallback(() => {
    tabContainer?.scrollTo({ left: 0, behavior: 'smooth' });
  }, [isTabOverflow, tabInvisiblePart]);

  const onNextClicked = useCallback(() => {
    tabContainer?.scrollTo({ left: 9999, behavior: 'smooth' });
  }, [isTabOverflow, tabInvisiblePart]);

  return (
    <div className={tabClass}>
      {isTabOverflow && (
        <span
          ref={prevPaddle}
          className="tab-prev-next-button tab-prev-button material-icons-round"
          onClick={onPrevClicked}
        >
          navigate_before
        </span>
      )}
      {isTabOverflow && (
        <span
          ref={nextPaddle}
          className="tab-prev-next-button tab-next-button material-icons-round"
          onClick={onNextClicked}
        >
          keyboard_arrow_right
        </span>
      )}
      <div ref={tabRef} className="tab-container" {...restProps}>
        {isTabOverflow && <div className="dummy-tab-div" />}
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
        {isTabOverflow && <div className="dummy-tab-div" />}
      </div>
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
