import React, { useEffect, useMemo } from 'react';
import '../Settings.scss';
import { useDispatch, useSelector } from 'react-redux';
import Input from '../../../common/Input/Input';
import Button from '../../../common/Button/Button';
import Loader from '../../../common/Loader/Loader';
import { getOrganizationDetails } from '../redux/SettingAction';

const SettingsOrganizationDetailsTab = () => {
  const organizationDetail = useSelector(
    ({ settingReducer }) => settingReducer.organizationDetails
  );
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getOrganizationDetails());
  }, []);
  const { isLoading } = useMemo(() => organizationDetail, [organizationDetail]);
  const settingsOrganizationDetails = [
    {
      title: 'Company Name',
      placeholder: 'Enter company name',
      value: organizationDetail?.name,
    },
    {
      title: 'Website',
      placeholder: 'Enter website',
      value: organizationDetail?.website,
    },
    {
      title: 'Contact',
      placeholder: 'Enter contact',
      value: organizationDetail?.contactNumber,
    },
    {
      title: 'Location',
      placeholder: 'Enter location',
      value: organizationDetail?.address,
    },
    {
      title: 'Risk Analyst',
      placeholder: 'Enter risk analyst',
      value: organizationDetail?.riskAnalyst,
    },
    {
      title: 'Service Manager',
      placeholder: 'Enter service manager',
      value: organizationDetail?.serviceManager,
    },
  ];

  return (
    <>
      <div className="common-white-container settings-organization-details">
        {!isLoading ? (
          <div className="settings-organization-details-row">
            {settingsOrganizationDetails.map(detail => (
              <>
                <span>{detail.title}</span>
                <Input type="text" placeholder={detail.placeholder} value={detail?.value} />
              </>
            ))}
          </div>
        ) : (
          <Loader />
        )}
      </div>
      <div className="d-flex just-end mt-15">
        <Button buttonType="primary" title="Edit" />
      </div>
    </>
  );
};

export default SettingsOrganizationDetailsTab;
