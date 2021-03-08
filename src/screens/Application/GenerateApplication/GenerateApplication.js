import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Stepper from '../../../common/Stepper/Stepper';
import ApplicationCompanyStep from './component/ApplicationCompanyStep/ApplicationCompanyStep';
import ApplicationPersonStep from './component/ApplicationPersonStep/ApplicationPersonStep';
import ApplicationCreditLimitStep from './component/ApplicationCreditLimitStep/ApplicationCreditLimitStep';
import ApplicationDocumentStep from './component/ApplicationDocumentsStep/ApplicationDocumentStep';
import ApplicationConfirmationStep from './component/ApplicationConfirmationStep/ApplicationConfirmationStep';
import { changeEditApplicationFieldValue } from '../redux/ApplicationAction';

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
  const dispatch = useDispatch();
  const stepIndex = useSelector(({ application }) => application.editApplication.currentStepIndex);

  const backToApplication = useCallback(() => {
    history.replace('/applications');
  }, [history]);

  const onChangeIndex = useCallback(newIndex => {
    dispatch(changeEditApplicationFieldValue('currentStepIndex', newIndex));
  }, []);

  return (
    <>
      <div className="breadcrumb-button-row">
        <div className="breadcrumb">
          <span onClick={backToApplication}>Application List</span>
          <span className="material-icons-round">navigate_next</span>
          <span>Generate Application</span>
        </div>
      </div>
      <Stepper className="mt-10" steps={steps} onChangeIndex={onChangeIndex} canGoNext>
        {STEP_COMPONENT[stepIndex]}
      </Stepper>
    </>
  );
};

export default GenerateApplication;
