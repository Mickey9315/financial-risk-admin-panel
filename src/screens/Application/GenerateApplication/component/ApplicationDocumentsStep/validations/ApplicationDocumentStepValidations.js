import { saveApplicationStepDataToBackend } from '../../../../redux/ApplicationAction';

export const applicationDocumentsStepValidations = async (dispatch, data, editApplicationData) => {
  let validated = true;
  if (validated) {
    const finalData = {
      stepper: 'documents',
      applicationId: editApplicationData?._id,
      /* entityType: editApplicationData.companyStep.entityType[0].value,
      ...data, */
    };
    try {
      await dispatch(saveApplicationStepDataToBackend(finalData));
    } catch (e) {
      throw Error()
    }
    validated = true;
  }
  /* dispatch(updateEditApplicationData('documents', {  })); */
  return validated;
};
