import React from 'react';
import '../Settings.scss';
import Input from '../../../common/Input/Input';
import Button from '../../../common/Button/Button';

const SettingsOrganizationDetailsTab = () => {
  const settingsOrganizationDetails = [
    {
      title: 'Company Name',
      placeholder: 'Enter company name',
    },
    {
      title: 'Website',
      placeholder: 'Enter website',
    },
    {
      title: 'Contact',
      placeholder: 'Enter contact',
    },
    {
      title: 'Location',
      placeholder: 'Enter location',
    },
    {
      title: 'Risk Analyst',
      placeholder: 'Enter risk analyst',
    },
    {
      title: 'Service Manager',
      placeholder: 'Enter service manager',
    },
  ];
  return (
    <>
      <div className="common-white-container settings-organization-details">
        <div className="settings-organization-details-row">
          {settingsOrganizationDetails.map(detail => (
            <>
              <span>{detail.title}</span>
              <Input type="text" placeholder={detail.placeholder} />
            </>
          ))}
        </div>
      </div>
      <div className="d-flex just-end mt-15">
        <Button buttonType="primary" title="Edit" />
      </div>
    </>
  );
};

export default SettingsOrganizationDetailsTab;
