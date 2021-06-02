import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Tab from '../../common/Tab/Tab';
import SettingsDocumentTypeTab from './Components/SettingsDocumentTypeTab';
import SettingsApiIntegrationTab from './Components/SettingsApiIntegrationTab';
import SettingsOrganizationDetailsTab from './Components/SettingsOrganizationDetailsTab';
import SettingsAuditLogTab from './Components/SettingsAuditLogTab';
import { setSettingActiveTabIndex } from './redux/SettingAction';

const Settings = () => {
  const settingsTabs = ['Document Type', 'API Integration', 'Organization Details', 'Audit log'];
  const settingsTabContent = [
    <SettingsDocumentTypeTab />,
    <SettingsApiIntegrationTab />,
    <SettingsOrganizationDetailsTab />,
    <SettingsAuditLogTab />,
  ];
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const tabActive = index => {
    setSettingActiveTabIndex(index);
    setActiveTabIndex(index);
  };

  const settingTabActiveIndex = useSelector(
    ({ settingReducer }) => settingReducer?.settingTabActiveIndex ?? 0
  );

  useEffect(() => {
    return () => setSettingActiveTabIndex(0);
  }, []);

  useEffect(() => {
    tabActive(settingTabActiveIndex);
  }, [settingTabActiveIndex]);

  return (
    <>
      <Tab
        tabs={settingsTabs}
        className="settings-tab"
        tabActive={tabActive}
        activeTabIndex={activeTabIndex}
      />
      <div>{settingsTabContent[activeTabIndex]}</div>
    </>
  );
};

export default Settings;
