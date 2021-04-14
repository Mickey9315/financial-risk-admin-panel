import { saveApplicationStepDataToBackend } from '../../../../redux/ApplicationAction';

export const applicationConfirmationStepValidations = (
  dispatch,
  data,
  editApplicationData,
  history
) => {
  let validated = true;
  if (validated) {
    const finalData = {
      stepper: 'confirmation',
      applicationId: editApplicationData._id,
    };
    try {
      dispatch(saveApplicationStepDataToBackend(finalData));
      history.replace('/applications?page=1&limit=15');
    } catch (e) {
      /**/
    }
    validated = true;
  }
  return validated;
};
