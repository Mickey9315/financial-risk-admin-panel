import React from 'react';
import { useHistory } from 'react-router-dom';
import Stepper from '../../../common/Stepper/Stepper';
import ApplicationCompanyStep from './component/ApplicationCompanyStep/ApplicationCompanyStep';

const steps = [
  {
    icon: 'local_police',
    text: 'Company',
  },
  {
    icon: 'admin_panel_settings',
    text: 'Person',
  },
  {
    icon: 'request_quote',
    text: 'Credit Limit',
  },
  {
    icon: 'description',
    text: 'Documents',
  },
  {
    icon: 'list_alt',
    text: 'Confirmation',
  },
];

const GenerateApplication = () => {
  const history = useHistory();

  const backToApplication = () => {
    history.replace('/applications');
  };

  return (
    <>
      <div className="breadcrumb-button-row">
        <div className="breadcrumb">
          <span onClick={backToApplication}>Application List</span>
          <span className="material-icons-round">navigate_next</span>
          <span>Generate Application</span>
        </div>
      </div>
      <Stepper steps={steps} />
      <ApplicationCompanyStep />
    </>
  );
};

export default GenerateApplication;
