import React from 'react';
import '../Settings.scss';
import Input from '../../../common/Input/Input';
import Button from '../../../common/Button/Button';

const SettingsApiIntegrationTab = () => {
  const settingsApiIntegrationRow = [
    {
      title: 'Equifax',
      inputs: [
        {
          title: 'App Id',
          placeholder: 'Enter app ID',
        },
        {
          title: 'App Secret',
          placeholder: 'Enter app secret',
        },
      ],
    },
    {
      title: 'Illion',
      inputs: [
        {
          title: 'App Id',
          placeholder: 'Enter app ID',
        },
        {
          title: 'App Secret',
          placeholder: 'Enter app secret',
        },
      ],
    },
    {
      title: 'Really Simple Systems',
      inputs: [
        {
          title: 'App Id',
          placeholder: 'Enter app ID',
        },
        {
          title: 'App Secret',
          placeholder: 'Enter app secret',
        },
      ],
    },
    {
      title: 'Australian Business Register',
      inputs: [
        {
          title: 'GUID',
          placeholder: 'Enter GUID',
        },
      ],
    },
  ];
  return (
    <>
      <div className="common-white-container settings-api-integration-container">
        {settingsApiIntegrationRow.map(row => (
          <div className="settings-row">
            <div>
              <div className="title">{row.title}</div>
              <div className="settings-input-container">
                {row.inputs.map(input => (
                  <>
                    <span className="settings-row-input-title">{input.title}</span>
                    <Input type="text" placeholder={input.placeholder} />
                  </>
                ))}
              </div>
            </div>
            <Button buttonType="primary" title="Edit" />
          </div>
        ))}
      </div>
    </>
  );
};

export default SettingsApiIntegrationTab;
