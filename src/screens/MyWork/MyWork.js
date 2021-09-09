import React, { useCallback, useMemo, useState } from 'react';
import Tab from '../../common/Tab/Tab';
import MyWorkTasks from './MyWorkTasks/MyWorkTasks';

import MyWorkNotifications from './MyWorkNotifications/MyWorkNotifications';
import { useModulePrivileges } from '../../hooks/userPrivileges/useModulePrivilegesHook';
import Loader from '../../common/Loader/Loader';

const MyWork = () => {
  const access = useModulePrivileges('task');

  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const myWorkTabs = useMemo(
    () => (access.hasReadAccess ? ['Tasks', 'Notifications'] : ['Notifications']),
    [access]
  );
  const myWorkTabContent = useMemo(
    () =>
      access.hasReadAccess ? [<MyWorkTasks />, <MyWorkNotifications />] : [<MyWorkNotifications />],
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
