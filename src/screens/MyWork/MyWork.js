import React, { useCallback, useState } from 'react';

import Tab from '../../common/Tab/Tab';
import MyWorkTasks from './MyWorkTasks/MyWorkTasks';

import MyWorkNotifications from './MyWorkNotifications/MyWorkNotifications';

const MyWork = () => {
  const myWorkTabs = ['Tasks', 'Notifications'];

  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const myWorkTabContent = [<MyWorkTasks />, <MyWorkNotifications />];

  const tabActive = useCallback(
    index => {
      setActiveTabIndex(index);
    },
    [setActiveTabIndex]
  );

  return (
    <>
      <div className="my-work-tab-button-row">
        <Tab
          tabs={myWorkTabs}
          tabActive={tabActive}
          activeTabIndex={activeTabIndex}
          className="my-work-tab"
        />
      </div>
      <div className="my-work-tab-content-container">{myWorkTabContent[activeTabIndex]}</div>
    </>
  );
};

export default MyWork;
