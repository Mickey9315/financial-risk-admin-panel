import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import ImportApplicationImportStep from './Components/ImportAplicationImportStep/ImportApplicationImportStep';
import Button from '../../../common/Button/Button';
import ImportApplicationValidateStep from './Components/ImportApplicationValidateStep/ImportApplicationValidateStep';
import ImportApplicationABNLookUpStep from './Components/ImportApplicationABNLookUpStep/ImportApplicationABNLookUpStep';
import ImportApplicationGenerateApplicationStep from './Components/ImportApplicationGenerateApplicationStep/ImportApplicationGenerateApplicationStep';
import ImportApplicationDownloadSample from './Components/ImportApplicationDownloadSample/ImportApplicationDownloadSample';
import {
  importApplicaionGoToNextStep,
  importApplicationSaveAndNext,
} from '../redux/ApplicationAction';
import { importApplicationImportStepValidations } from './Components/ImportAplicationImportStep/ImportApplicationImportStepValidations';
import { errorNotification } from '../../../common/Toast';

const STEPS = [
  {
    text: 'Download File',
    name: 'downloadFile',
  },
  {
    text: 'Import File',
    name: 'importFile',
    button: 'Import File',
  },
  {
    text: 'Validate Application',
    name: 'validateApplication',
    button: 'Validate Applications',
  },
  {
    text: 'ABN/NZBN LookUp',
    name: 'abnLookUp',
    button: 'ABN/NZBN LookUp',
  },
  {
    text: 'Generate Applications',
    name: 'generateApplication',
    button: 'Generate Applications',
  },
];
const STEP_COMPONENT = [
  <ImportApplicationDownloadSample />,
  <ImportApplicationImportStep />,
  <ImportApplicationValidateStep />,
  <ImportApplicationABNLookUpStep />,
  <ImportApplicationGenerateApplicationStep />,
];
const ImportApplicationStepper = ({ oncancelImportApplicationModal }) => {
  const dispatch = useDispatch();

  const { importApplication } = useSelector(({ application }) => application ?? {});
  const activeStep = useMemo(() => importApplication?.activeStep ?? 0, [importApplication]);
  const importId = useMemo(() => importApplication?.importId ?? null, [importApplication]);
  const { toBeProcessedApplicationCount } = useMemo(() => importApplication?.importData ?? 0, [
    importApplication,
  ]);

  const { saveAndNextIALoader, deleteDumpFromBackEndLoader } = useSelector(
    ({ generalLoaderReducer }) => generalLoaderReducer ?? false
  );

  const validate = useCallback(async () => {
    const data = importApplication?.[STEPS?.[activeStep ?? 0]?.name];
    try {
      switch (STEPS?.[activeStep]?.name) {
        case 'downloadFile':
          return true;
        case 'importFile':
          return await importApplicationImportStepValidations(dispatch, data);
        case 'validateApplication':
          return await dispatch(importApplicationSaveAndNext(importId, 'VALIDATE_APPLICATIONS'));
        case 'abnLookUp':
          return await dispatch(importApplicationSaveAndNext(importId, 'GENERATE_APPLICATIONS'));
        case 'generateApplication':
          return true;
        default:
          return false;
      }
    } catch (e) {
      /**/
    }
    return false;
  }, [importApplication, activeStep, importId]);

  const onClickNextStep = useCallback(async () => {
    if (toBeProcessedApplicationCount !== 0) {
      const result = await validate();
      if (result && activeStep < STEPS.length - 1) {
        dispatch(importApplicaionGoToNextStep());
      }
    } else {
      errorNotification('No application to be processed.');
    }
  }, [activeStep, validate, toBeProcessedApplicationCount]);

  return (
    <div className="mt-10">
      <div className="ia-stepper-container">
        {STEPS.map((step, index) => (
          <div
            key={index.toString()}
            className={`ia-stepper-item ${index <= activeStep && 'ia-done-step'}`}
          >
            <div className={`ia-step-circle ${index <= activeStep && 'ia-done-step'} `} />
            <div className={`ia-step-name ${index <= activeStep && 'ia-done-step'}`}>
              {step.text}
            </div>
          </div>
        ))}
      </div>
      <div className="ia-step-content">
        {!saveAndNextIALoader ? (
          STEP_COMPONENT[activeStep]
        ) : (
          <span className="no-record-found">Processing applications please wait...</span>
        )}
      </div>
      <div className="ia-step-button-row">
        {activeStep < STEPS.length - 1 && (
          <Button
            buttonType="outlined-primary"
            title="Cancel"
            onClick={oncancelImportApplicationModal}
            isLoading={deleteDumpFromBackEndLoader}
          />
        )}
        {activeStep === STEPS.length - 1 && (
          <Button
            buttonType="outlined-primary"
            title="close"
            onClick={oncancelImportApplicationModal}
            isLoading={deleteDumpFromBackEndLoader}
          />
        )}
        {activeStep < STEPS.length - 1 && (
          <Button
            className="ml-15"
            buttonType="primary"
            title={STEPS[activeStep + 1].button}
            onClick={onClickNextStep}
            isLoading={saveAndNextIALoader}
          />
        )}
      </div>
    </div>
  );
};

ImportApplicationStepper.propTypes = {
  oncancelImportApplicationModal: PropTypes.func.isRequired,
};

export default ImportApplicationStepper;
