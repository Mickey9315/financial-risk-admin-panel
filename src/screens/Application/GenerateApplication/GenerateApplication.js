import React, { useCallback, useEffect, useMemo } from 'react';
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
  resetEditApplicationFieldValue,
} from '../redux/ApplicationAction';
import { applicationCreditStepValidations } from './component/ApplicationCreditLimitStep/validations/ApplicationCreditStepValidations';
import { applicationPersonStepValidation } from './component/ApplicationPersonStep/validations/ApplicationPersonStepValidations';
import { applicationDocumentsStepValidations } from './component/ApplicationDocumentsStep/validations/ApplicationDocumentStepValidations';
import { applicationConfirmationStepValidations } from './component/ApplicationConfirmationStep/validations/ApplicationConfirmationStepValidation';
import { useQueryParams } from '../../../hooks/GetQueryParamHook';
import Loader from '../../../common/Loader/Loader';

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
    ({ application }) => application?.editApplication ?? {}
  );
  const { applicationId } = useQueryParams();

  const { generateApplicationPageLoaderAction } = useSelector(
    ({ loaderButtonReducer }) => loaderButtonReducer ?? false
  );

  // for stepper components
  const FILTERED_STEP_COMPONENT = useMemo(() => {
    const finalSteps = [...STEP_COMPONENT];
    if (
      !['PARTNERSHIP', 'TRUST', 'SOLE_TRADER'].includes(
        editApplicationData?.company?.entityType?.value ?? ''
      )
    ) {
      finalSteps.splice(1, 1);
    }

    return finalSteps;
  }, [editApplicationData?.company?.entityType, STEP_COMPONENT]);

  // for stepper headings

  const FILTERED_STEPS = useMemo(() => {
    let finalSteps = [...steps];
    const entityType = editApplicationData?.company?.entityType?.value ?? '';

    if (!['PARTNERSHIP', 'TRUST', 'SOLE_TRADER'].includes(entityType)) {
      finalSteps.splice(1, 1);
    } else {
      finalSteps = finalSteps.map(step => {
        if (step.text === 'Person')
          return {
            ...step,
            text: editApplicationData?.company?.entityType?.label ?? '',
          };
        return step;
      });
    }

    return finalSteps;
  }, [editApplicationData?.company?.entityType, steps]);

  const onChangeIndex = useCallback(newIndex => {
    dispatch(changeEditApplicationFieldValue('applicationStage', newIndex));
  }, []);

  useEffect(() => {
    return () => dispatch(resetEditApplicationFieldValue);
  }, []);

  useEffect(() => {
    if (applicationId) {
      dispatch(getApplicationDetail(applicationId));
    }
  }, [applicationId]);

  useEffect(() => {
    if (editApplicationData && editApplicationData?._id) {
      const params = {
        applicationId: editApplicationData?._id,
      };
      const url = Object.entries(params)
        .filter(arr => arr[1] !== undefined)
        .map(([k, v]) => `${k}=${v}`)
        .join('&');

      history.replace(`${history.location.pathname}?${url}`);
    }
  }, [editApplicationData?._id, history]);

  const backToApplication = useCallback(() => {
    history.replace('/applications');
  }, [history]);

  const addStepClick = useCallback(() => {
    dispatch(addPersonDetail('individual'));
  }, []);

  const onNextClick = useCallback(async () => {
    const data = editApplicationData?.[FILTERED_STEPS?.[applicationStage ?? 0]?.name];
    try {
      switch (FILTERED_STEPS?.[applicationStage ?? 0]?.name) {
        case 'company':
          return await applicationCompanyStepValidations(dispatch, data, editApplicationData);

        case 'partners':
          return await applicationPersonStepValidation(dispatch, data, editApplicationData);

        case 'creditLimit':
          return await applicationCreditStepValidations(dispatch, data, editApplicationData);

        case 'documents':
          return await applicationDocumentsStepValidations(dispatch, data, editApplicationData);
        case 'confirmationStep':
          return await applicationConfirmationStepValidations(
            dispatch,
            data,
            editApplicationData,
            history
          );

        default:
          return false;
      }
    } catch (e) {
      /**/
    }
    return false;
  }, [editApplicationData, applicationStage, FILTERED_STEPS, history]);

  return (
    <>
      {!generateApplicationPageLoaderAction ? (
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
            steps={FILTERED_STEPS}
            stepIndex={applicationStage ?? 0}
            onChangeIndex={onChangeIndex}
            nextClick={onNextClick}
            addStepClick={addStepClick}
          >
            {FILTERED_STEP_COMPONENT[applicationStage ?? 0]}
          </Stepper>
        </>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default GenerateApplication;
