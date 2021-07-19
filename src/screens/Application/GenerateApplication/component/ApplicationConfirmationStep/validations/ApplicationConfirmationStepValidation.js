import { saveApplicationStepDataToBackend } from '../../../../redux/ApplicationAction';

export const applicationConfirmationStepValidations = async (
  dispatch,
  data,
  editApplicationData,
  history
) => {
  let validated = true;
  if (validated) {
    const finalData = {
      stepper: 'confirmation',
      applicationId: editApplicationData?._id,
    };
    try {
      await dispatch(saveApplicationStepDataToBackend(finalData));
      history.replace('/applications');
    } catch (e) {
      throw Error();
    }
    validated = true;
  }
  return validated;
};
