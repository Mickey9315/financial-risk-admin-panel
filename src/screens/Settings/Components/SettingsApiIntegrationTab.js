import React, { useEffect, useMemo } from 'react';
import '../Settings.scss';
import { useDispatch, useSelector } from 'react-redux';
import Input from '../../../common/Input/Input';
import Button from '../../../common/Button/Button';
import Loader from '../../../common/Loader/Loader';
import { getApiIntegration } from '../redux/SettingAction';

const SettingsApiIntegrationTab = () => {
  const apiIntegrationDetails = useSelector(({ settingReducer }) => settingReducer.apiIntegration);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getApiIntegration());
  }, []);
  const { isLoading, integration } = useMemo(() => apiIntegrationDetails, [apiIntegrationDetails]);
  const settingsApiIntegrationRow = [
    {
      title: 'Equifax',
      inputs: [
        {
          title: 'User name',
          placeholder: 'Enter user name',
          value: integration?.equifax?.username,
        },
        {
          title: 'Password',
          placeholder: 'Enter password',
          value: integration?.equifax?.password,
        },
      ],
    },
    {
      title: 'Illion',
      inputs: [
        {
          title: 'User Id',
          placeholder: 'Enter user ID',
          value: integration?.illion?.userId,
        },
        {
          title: 'Subscriber ID',
          placeholder: 'Enter subscriber ID',
          value: integration?.illion?.subscriberId,
        },
        {
          title: 'Password',
          placeholder: 'Enter password',
          value: integration?.illion?.password,
        },
      ],
    },
    {
      title: 'Really Simple Systems',
      inputs: [
        {
          title: 'Access Token',
          placeholder: 'Enter access token',
          type: 'textarea',
          value: integration?.rss?.accessToken,
        },
      ],
    },
    {
      title: 'Australian Business Register',
      inputs: [
        {
          title: 'GUID',
          placeholder: 'Enter GUID',
          value: integration?.abn?.guid,
        },
      ],
    },
  ];
  return (
    <>
      <div className="common-white-container settings-api-integration-container">
        {!isLoading ? (
          settingsApiIntegrationRow.map(row => (
            <div className="settings-row">
              <div>
                <div className="title">{row.title}</div>
                <div className="settings-input-container">
                  {row.inputs.map(input => (
                    <>
                      <span className="settings-row-input-title">{input.title}</span>
                      {input?.type !== 'textarea' ? (
                        <Input type="text" placeholder={input.placeholder} value={input.value} />
                      ) : (
                        <textarea rows={6} placeholder={input.placeholder} value={input.value} />
                      )}
                    </>
                  ))}
                </div>
              </div>
              <Button buttonType="primary" title="Edit" />
            </div>
          ))
        ) : (
          <Loader />
        )}
      </div>
    </>
  );
};

export default SettingsApiIntegrationTab;
