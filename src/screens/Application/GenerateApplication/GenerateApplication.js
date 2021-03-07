import React, { useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import Stepper from '../../../common/Stepper/Stepper';
import ApplicationCompanyStep from './component/ApplicationCompanyStep/ApplicationCompanyStep';
import ApplicationPersonStep from './component/ApplicationPersonStep/ApplicationPersonStep';
import ApplicationCreditLimitStep from './component/ApplicationCreditLimitStep/ApplicationCreditLimitStep';
import ApplicationDocumentStep from './component/ApplicationDocumentsStep/ApplicationDocumentStep';
import ApplicationConfirmationStep from './component/ApplicationConfirmationStep/ApplicationConfirmationStep';

const STEP_COMPONENT = [
  <ApplicationCompanyStep />,
  <ApplicationPersonStep />,
  <ApplicationCreditLimitStep />,
  <ApplicationDocumentStep />,
  <ApplicationConfirmationStep />,
];

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
  const [index, setIndex] = useState(0);

  const backToApplication = () => {
    history.replace('/applications');
  };
  const stepNextPermission = true;
  const onChangeIndex = useCallback(
    newIndex => {
      console.log(newIndex);
      setIndex(newIndex);
    },
    [setIndex]
  );

  return (
    <>
      <div className="breadcrumb-button-row">
        <div className="breadcrumb">
          <span onClick={backToApplication}>Application List</span>
          <span className="material-icons-round">navigate_next</span>
          <span>Generate Application</span>
        </div>
      </div>
      <Stepper
        className="mt-10"
        steps={steps}
        onChangeIndex={onChangeIndex}
        canGoNext={stepNextPermission}
      >
        {STEP_COMPONENT[index]}
      </Stepper>
    </>
  );
};

export default GenerateApplication;
