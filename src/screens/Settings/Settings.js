import React, { useState } from 'react';
import Tab from '../../common/Tab/Tab';
import SettingsDocumentTypeTab from './Components/SettingsDocumentTypeTab';
import SettingsApiIntegrationTab from './Components/SettingsApiIntegrationTab';
import SettingsOrganizationDetailsTab from './Components/SettingsOrganizationDetailsTab';
import SettingsAuditLogTab from './Components/SettingsAuditLogTab';

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
    setActiveTabIndex(index);
  };

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
