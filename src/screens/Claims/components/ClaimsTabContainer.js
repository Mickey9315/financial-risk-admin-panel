import { useSelector } from 'react-redux';
import { useCallback, useMemo, useState } from 'react';
import Tab from '../../../common/Tab/Tab';
import ClaimsDocumentsTab from './ClaimsDocumentsTab';

const CLAIMS_TABS_CONSTANTS = [
  { label: 'Documents', component: <ClaimsDocumentsTab />, name: 'document' },
];

const ClaimsTabContainer = () => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const tabActive = index => {
    // setViewDebtorActiveTabIndex(index);
    setActiveTabIndex(index);
  };
  const userPrivilegesData = useSelector(({ userPrivileges }) => userPrivileges);

  const checkAccess = useCallback(
    accessFor => {
      const availableAccess =
        userPrivilegesData.filter(module => module.accessTypes.length > 0) ?? [];
      const isAccessible = availableAccess.filter(module => module?.name === accessFor);
      return isAccessible?.length > 0;
    },
    [userPrivilegesData]
  );

  const finalTabs = useMemo(() => {
    const tabs = [];
    CLAIMS_TABS_CONSTANTS.forEach(tab => {
      if (checkAccess(tab.name)) {
        tabs.push(tab);
      }
    });
    return tabs ?? [];
  }, [CLAIMS_TABS_CONSTANTS, checkAccess]);

  // tabs end
  return (
    <>
      <Tab
        tabs={finalTabs.map(tab => tab?.label)}
        tabActive={tabActive}
        activeTabIndex={activeTabIndex}
        className="mt-15"
      />
      <div className="common-white-container">{finalTabs?.[activeTabIndex]?.component}</div>
    </>
  );
};

export default ClaimsTabContainer;
