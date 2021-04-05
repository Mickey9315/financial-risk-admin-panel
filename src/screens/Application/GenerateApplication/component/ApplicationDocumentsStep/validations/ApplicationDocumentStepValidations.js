import { saveApplicationStepDataToBackend } from '../../../../redux/ApplicationAction';

export const applicationDocumentsStepValidations = (dispatch, data, editApplicationData) => {
  let validated = true;
  console.log('applicationDocumentsStepValidations', data);
  if (validated) {
    const finalData = {
      stepper: 'documents',
      applicationId: editApplicationData.applicationId,
      /* entityType: editApplicationData.companyStep.entityType[0].value,
      ...data, */
    };
    console.log('finalData', finalData);
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
