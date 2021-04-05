import {
  saveApplicationStepDataToBackend,
  updateEditApplicationData,
} from '../../../../redux/ApplicationAction';
import { NUMBER_REGEX } from '../../../../../../constants/RegexConstants';

export const applicationCreditStepValidations = (dispatch, data, editApplicationData) => {
  const errors = {};
  let validated = true;

  if (!data.isExtendedPaymentTerms || data.isExtendedPaymentTerms.trim().length <= 0) {
    errors.isExtendedPaymentTerms = 'Please select any one option';
    validated = false;
  }
  if (
    data.isExtendedPaymentTerms === 'yes' &&
    (!data.extendedPaymentTermsDetails || data.extendedPaymentTermsDetails.trim().length <= 0)
  ) {
    errors.extendedPaymentTermsDetails = 'Please provide details';
    validated = false;
  }
  if (!data.isPassedOverdueAmount || data.isPassedOverdueAmount.trim().length <= 0) {
    errors.isPassedOverdueAmount = 'Please select any one option';
    validated = false;
  }
  if (
    data.isPassedOverdueAmount === 'yes' &&
    (!data.passedOverdueDetails || data.passedOverdueDetails.trim().length <= 0)
  ) {
    errors.passedOverdueDetails = 'Please provide details';
    validated = false;
  }
  if (!data.creditLimit || data.creditLimit.trim().length <= 0) {
    errors.creditLimit = 'Please enter credit limit amount';
    validated = false;
  } else if (!data.creditLimit.match(NUMBER_REGEX)) {
    errors.creditLimit = 'Please enter valid credit limit amount';
    validated = false;
  } else if (parseInt(data.creditLimit, 10) === 0) {
    errors.creditLimit = 'Credit limit should be greater than zero';
    validated = false;
  }

  if (validated) {
    const { isExtendedPaymentTerms, isPassedOverdueAmount } = data;

    const finalData = {
      stepper: 'credit-limit',
      applicationId: editApplicationData.applicationId,
      entityType: editApplicationData.companyStep.entityType[0].value,
      ...data,
      isExtendedPaymentTerms: isExtendedPaymentTerms === 'yes',
      isPassedOverdueAmount: isPassedOverdueAmount === 'no',
    };

    try {
      dispatch(saveApplicationStepDataToBackend(finalData));
    } catch (e) {
      /**/
    }
    validated = true;
  }
  dispatch(updateEditApplicationData('creditLimitStep', { errors }));
  return validated;
};
