import React, { useCallback, useEffect, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Stepper from '../../../common/Stepper/Stepper';
import DebtorCompanyStep from './component/DebtorCompanyStep/DebtorCompanyStep';
import DebtorDocumentStep from './component/DebtorDocumentsStep/DebtorDocumentStep';
import DebtorConfirmationStep from './component/DebtorConfirmationStep/DebtorConfirmationStep';
import { debtorCompanyStepValidations } from './component/DebtorCompanyStep/validations/DebtorCompanyStepValidations';
import {
  addPersonDetail,
  changeEditDebtorFieldValue,
  getDebtorDetail,
  resetEditDebtorFieldValue,
} from '../redux/DebtorsAction';
import { debtorDocumentsStepValidations } from './component/DebtorDocumentsStep/validations/DebtorDocumentStepValidations';
import { debtorConfirmationStepValidations } from './component/DebtorConfirmationStep/validations/DebtorConfirmationStepValidation';
import { useQueryParams } from '../../../hooks/GetQueryParamHook';
import Loader from '../../../common/Loader/Loader';

const STEP_COMPONENT = [<DebtorCompanyStep />, <DebtorDocumentStep />, <DebtorConfirmationStep />];

const steps = [
  {
    icon: 'local_police',
    text: 'Company',
    name: 'company',
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

const GenerateDebtor = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { debtorStage, ...editDebtorData } = useSelector(
    ({ debtorsManagement }) => debtorsManagement?.editDebtor ?? {}
  );

  const { debtorId } = useQueryParams();

  const { generateDebtorPageLoaderAction } = useSelector(
    ({ generalLoaderReducer }) => generalLoaderReducer ?? false
  );

  // for stepper components
  const FILTERED_STEP_COMPONENT = useMemo(() => {
    const finalSteps = [...STEP_COMPONENT];
    if (
      !['PARTNERSHIP', 'TRUST', 'SOLE_TRADER'].includes(
        editDebtorData?.company?.entityType?.value ?? ''
      )
    ) {
      // finalSteps.splice(1, 1);
    }

    return finalSteps;
  }, [editDebtorData?.company?.entityType, STEP_COMPONENT]);

  // for stepper headings

  const FILTERED_STEPS = useMemo(() => {
    let finalSteps = [...steps];
    const entityType = editDebtorData?.company?.entityType?.value ?? '';

    if (!['PARTNERSHIP', 'TRUST', 'SOLE_TRADER'].includes(entityType)) {
      // finalSteps.splice(1, 1);
    } else {
      finalSteps = finalSteps.map(step => {
        return step;
      });
    }

    return finalSteps;
  }, [editDebtorData?.company?.entityType, steps]);

  const onChangeIndex = useCallback(newIndex => {
    dispatch(changeEditDebtorFieldValue('debtorStage', newIndex));
  }, []);

  useEffect(() => {
    return () => dispatch(resetEditDebtorFieldValue);
  }, []);

  useEffect(() => {
    if (debtorId) {
      dispatch(getDebtorDetail(debtorId));
    }
  }, [debtorId]);

  useEffect(() => {
    if (editDebtorData && editDebtorData?._id) {
      const params = {
        debtorId: editDebtorData?._id,
      };
      const url = Object.entries(params)
        .filter(arr => arr[1] !== undefined)
        .map(([k, v]) => `${k}=${v}`)
        .join('&');

      history.replace(`${history.location.pathname}?${url}`);
    }
  }, [editDebtorData?._id, history]);

  const backToDebtor = useCallback(() => {
    history.replace('/debtors');
  }, [history]);

  const addStepClick = useCallback(() => {
    dispatch(addPersonDetail('individual'));
  }, []);

  const onNextClick = useCallback(async () => {
    const data = editDebtorData?.[FILTERED_STEPS?.[debtorStage ?? 0]?.name];
    try {
      switch (FILTERED_STEPS?.[debtorStage ?? 0]?.name) {
        case 'company': {
          const validationResult = await debtorCompanyStepValidations(
            dispatch,
            data,
            editDebtorData
          );
          return validationResult;
        }

        case 'documents':
          return await debtorDocumentsStepValidations(dispatch, data, editDebtorData);

        case 'confirmationStep':
          return await debtorConfirmationStepValidations(dispatch, data, editDebtorData, history);

        default:
          return false;
      }
    } catch (e) {
      /**/
    }
    return false;
  }, [editDebtorData, debtorStage, FILTERED_STEPS, history]);

  return (
    <>
      {!generateDebtorPageLoaderAction ? (
        <>
          <div className="breadcrumb-button-row">
            <div className="breadcrumb">
              <span onClick={backToDebtor}>Debtor List</span>
              <span className="material-icons-round">navigate_next</span>
              <span>Add Debtor</span>
            </div>
          </div>
          <Stepper
            className="mt-10"
            steps={FILTERED_STEPS}
            stepIndex={debtorStage ?? 0}
            onChangeIndex={onChangeIndex}
            nextClick={onNextClick}
            addStepClick={addStepClick}
          >
            {FILTERED_STEP_COMPONENT[debtorStage ?? 0]}
          </Stepper>
        </>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default GenerateDebtor;
