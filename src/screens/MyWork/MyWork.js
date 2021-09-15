import React, { useCallback, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import Tab from '../../common/Tab/Tab';
import MyWorkTasks from './MyWorkTasks/MyWorkTasks';

import MyWorkNotifications from './MyWorkNotifications/MyWorkNotifications';
import Loader from '../../common/Loader/Loader';

const MyWork = () => {
  const userPrivilegesData = useSelector(({ userPrivileges }) => userPrivileges);
  const access = useCallback(
    accessFor => {
      const availableAccess =
        userPrivilegesData.filter(module => module.accessTypes.length > 0) ?? [];
      const isAccessible = availableAccess.filter(module => module?.name === accessFor);
      return isAccessible?.length > 0;
    },
    [userPrivilegesData]
  );

  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const myWorkTabs = useMemo(
    () => (access('policy') ? ['Tasks', 'Notifications'] : ['Notifications']),
    [access]
  );
  const myWorkTabContent = useMemo(
    () =>
      access('policy') ? [<MyWorkTasks />, <MyWorkNotifications />] : [<MyWorkNotifications />],
    [access]
  );
  const tabActive = useCallback(
    index => {
      setActiveTabIndex(index);
    },
    [setActiveTabIndex]
  );

  return (
    <>
      {myWorkTabs.length > 0 ? (
        <>
          <div className="my-work-tab-button-row">
            <Tab
              tabs={myWorkTabs}
              tabActive={tabActive}
              activeTabIndex={activeTabIndex}
              className="my-work-tab"
            />
          </div>
          <div className="my-work-tab-content-container">{myWorkTabContent[activeTabIndex]}</div>{' '}
        </>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default MyWork;
