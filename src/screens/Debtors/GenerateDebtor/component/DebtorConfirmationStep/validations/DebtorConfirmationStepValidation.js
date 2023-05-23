import { getDebtorFilter, saveDebtorStepDataToBackend } from '../../../../redux/DebtorsAction';

export const debtorConfirmationStepValidations = async (dispatch, data, editDebtorData, history) => {
  let validated = true;
  if (validated) {
    const finalData = {
      stepper: 'confirmation',
      debtorId: editDebtorData?._id,
    };
    try {
      await dispatch(saveDebtorStepDataToBackend(finalData));
      history.replace('/debtors');
      await dispatch(getDebtorFilter());
    } catch (e) {
      throw Error();
    }
    validated = true;
  }

  return validated;
};
