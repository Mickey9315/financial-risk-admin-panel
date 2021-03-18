import { updateEditApplicationData } from '../../../../redux/ApplicationAction';
import { NUMBER_REGEX } from '../../../../../../constants/RegexConstants';

export const applicationCreditStepValidations = (dispatch, data) => {
  const errors = {};
  let validated = false;
  console.log(data);
  if (!data.isExtendedPaymentTerms || data.isExtendedPaymentTerms.trim().length <= 0) {
    errors.isExtendedPaymentTerms = 'Please select any one option';
  }
  if (
    data.isExtendedPaymentTerms === 'yes' &&
    (!data.extendedPaymentTermsDetails || data.extendedPaymentTermsDetails.trim().length <= 0)
  ) {
    errors.extendedPaymentTermsDetails = 'Please provide details';
  }
  if (!data.isPassedOverdueAmount || data.isPassedOverdueAmount.trim().length <= 0) {
    errors.isPassedOverdueAmount = 'Please select any one option';
  }
  if (
    data.isPassedOverdueAmount === 'yes' &&
    (!data.passedOverdueDetails || data.passedOverdueDetails.trim().length <= 0)
  ) {
    errors.passedOverdueDetails = 'Please provide details';
  }
  if (!data.creditLimit || data.creditLimit.trim().length <= 0) {
    errors.creditLimit = 'Please enter credit limit amount';
  } else if (!data.creditLimit.match(NUMBER_REGEX)) {
    errors.creditLimit = 'Please enter valid credit limit amount';
  } else if (parseInt(data.creditLimit, 10) === 0) {
    errors.creditLimit = 'Credit limit should be greater than zero';
  }

  if (validated) {
    const { isExtendedPaymentTerms, isPassedOverdueAmount } = data;

    const finalData = {
      stepper: 'credit-limit',
      entityType: '',
      applicationId: '',
      ...data,
      isExtendedPaymentTerms: isExtendedPaymentTerms === 'yes',
      isPassedOverdueAmount: isPassedOverdueAmount === 'no',
    };
    console.log({ finalData });
    validated = true;
  }
  dispatch(updateEditApplicationData('creditLimitStep', { errors }));
  return validated;
};
