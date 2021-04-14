import React, { useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Stepper from '../../../common/Stepper/Stepper';
import ApplicationCompanyStep from './component/ApplicationCompanyStep/ApplicationCompanyStep';
import ApplicationPersonStep from './component/ApplicationPersonStep/ApplicationPersonStep';
import ApplicationCreditLimitStep from './component/ApplicationCreditLimitStep/ApplicationCreditLimitStep';
import ApplicationDocumentStep from './component/ApplicationDocumentsStep/ApplicationDocumentStep';
import ApplicationConfirmationStep from './component/ApplicationConfirmationStep/ApplicationConfirmationStep';
import { applicationCompanyStepValidations } from './component/ApplicationCompanyStep/validations/ApplicationCompanyStepValidations';
import {
  addPersonDetail,
  changeEditApplicationFieldValue,
  getApplicationDetail,
} from '../redux/ApplicationAction';
import { applicationCreditStepValidations } from './component/ApplicationCreditLimitStep/validations/ApplicationCreditStepValidations';
import { applicationPersonStepValidation } from './component/ApplicationPersonStep/validations/ApplicationPersonStepValidations';
import { applicationDocumentsStepValidations } from './component/ApplicationDocumentsStep/validations/ApplicationDocumentStepValidations';
import { applicationConfirmationStepValidations } from './component/ApplicationConfirmationStep/validations/ApplicationConfirmationStepValidation';
import { useQueryParams } from '../../../hooks/GetQueryParamHook';

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
    name: 'company',
  },
  {
    icon: 'admin_panel_settings',
    text: 'Person',
    name: 'partners',
  },
  {
    icon: 'request_quote',
    text: 'Credit Limit',
    name: 'creditLimit',
  },
  {
    icon: 'description',
    text: 'Documents',
    name: 'documents',
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
  const { applicationStage, ...editApplicationData } = useSelector(
    ({ application }) => application.editApplication
  );
  const { applicationId } = useQueryParams();

  const onChangeIndex = useCallback(newIndex => {
    dispatch(changeEditApplicationFieldValue('applicationStage', newIndex));
  }, []);

  useEffect(() => {
    if (applicationId) {
      dispatch(getApplicationDetail(applicationId));
    }
  }, [applicationId]);

  useEffect(() => {
    if (editApplicationData && editApplicationData._id) {
      const params = {
        applicationId: editApplicationData._id,
      };
      const url = Object.entries(params)
        .filter(arr => arr[1] !== undefined)
        .map(([k, v]) => `${k}=${v}`)
        .join('&');

      history.replace(`${history.location.pathname}?${url}`);
    }
  }, [editApplicationData._id, history]);

  const backToApplication = useCallback(() => {
    history.replace('/applications');
  }, [history]);

  const addStepClick = useCallback(() => {
    dispatch(addPersonDetail('individual'));
  }, []);

  const onNextClick = useCallback(() => {
    const data = editApplicationData[steps[applicationStage].name];
    switch (applicationStage) {
      case 0:
        return applicationCompanyStepValidations(dispatch, data, editApplicationData);
      case 1:
        return applicationPersonStepValidation(dispatch, data, editApplicationData);
      case 2:
        return applicationCreditStepValidations(dispatch, data, editApplicationData);
      case 3:
        return applicationDocumentsStepValidations(dispatch, data, editApplicationData);
      case 4:
        return applicationConfirmationStepValidations(dispatch, data, editApplicationData, history);

      default:
        return false;
    }
  }, [editApplicationData, applicationStage]);

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
        stepIndex={applicationStage}
        onChangeIndex={onChangeIndex}
        canGoNext
        nextClick={onNextClick}
        addStepClick={addStepClick}
      >
        {STEP_COMPONENT[applicationStage]}
      </Stepper>
    </>
  );
};

export default GenerateApplication;
