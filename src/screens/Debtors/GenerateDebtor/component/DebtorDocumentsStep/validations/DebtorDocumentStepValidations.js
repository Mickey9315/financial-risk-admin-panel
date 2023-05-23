import { saveDebtorStepDataToBackend } from '../../../../redux/DebtorsAction';

export const debtorDocumentsStepValidations = async (dispatch, data, editDebtorData) => {
  let validated = true;
  if (validated) {
    const finalData = {
      stepper: 'documents',
      debtorId: editDebtorData?._id,
      /* entityType: editDebtorData.companyStep.entityType[0].value,
      ...data, */
    };
    try {
      await dispatch(saveDebtorStepDataToBackend(finalData));
    } catch (e) {
      throw Error();
    }
    validated = true;
  }
  /* dispatch(updateEditDebtorData('documents', {  })); */
  return validated;
};
