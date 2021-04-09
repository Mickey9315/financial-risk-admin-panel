import { saveApplicationStepDataToBackend } from '../../../../redux/ApplicationAction';

export const applicationDocumentsStepValidations = (dispatch, data, editApplicationData) => {
  let validated = true;
  if (validated) {
    const finalData = {
      stepper: 'documents',
      applicationId: editApplicationData.applicationId,
      /* entityType: editApplicationData.companyStep.entityType[0].value,
      ...data, */
    };
    try {
      dispatch(saveApplicationStepDataToBackend(finalData));
    } catch (e) {
      /**/
    }
    validated = true;
  }
  /* dispatch(updateEditApplicationData('documents', {  })); */
  return validated;
};
