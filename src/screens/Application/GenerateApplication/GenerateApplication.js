import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Stepper from '../../../common/Stepper/Stepper';
import ApplicationCompanyStep from './component/ApplicationCompanyStep/ApplicationCompanyStep';
import ApplicationPersonStep from './component/ApplicationPersonStep/ApplicationPersonStep';
import ApplicationCreditLimitStep from './component/ApplicationCreditLimitStep/ApplicationCreditLimitStep';
import ApplicationDocumentStep from './component/ApplicationDocumentsStep/ApplicationDocumentStep';
import ApplicationConfirmationStep from './component/ApplicationConfirmationStep/ApplicationConfirmationStep';
import { applicationCompanyStepValidations } from './component/ApplicationCompanyStep/validations/ApplicationCompanyStepValidations';
import { changeEditApplicationFieldValue } from '../redux/ApplicationAction';
import { applicationCreditStepValidations } from './component/ApplicationCreditLimitStep/validations/ApplicationCreditStepValidations';

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
    name: 'companyStep',
  },
  {
    icon: 'admin_panel_settings',
    text: 'Person',
    name: 'personStep',
  },
  {
    icon: 'request_quote',
    text: 'Credit Limit',
    name: 'creditLimitStep',
  },
  {
    icon: 'description',
    text: 'Documents',
    name: 'documentStep',
  },
  {
    icon: 'list_alt',
    text: 'Confirmation',
    name: 'confirmationStep',
  },
];

const GenerateApplication = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { currentStepIndex: stepIndex, ...editApplicationData } = useSelector(
    ({ application }) => application.editApplication
  );

  const backToApplication = useCallback(() => {
    history.replace('/applications');
  }, [history]);

  const onChangeIndex = useCallback(newIndex => {
    dispatch(changeEditApplicationFieldValue('currentStepIndex', newIndex));
  }, []);

  const onNextClick = useCallback(() => {
    switch (stepIndex) {
      case 0:
        return applicationCompanyStepValidations(
          dispatch,
          editApplicationData[steps[stepIndex].name]
        );
      case 2:
        return applicationCreditStepValidations(
          dispatch,
          editApplicationData[steps[stepIndex].name]
        );

      default:
        return false;
    }
  }, [editApplicationData, stepIndex]);

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
        canGoNext
        nextClick={onNextClick}
      >
        {STEP_COMPONENT[stepIndex]}
      </Stepper>
    </>
  );
};

export default GenerateApplication;
