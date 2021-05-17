import {
  saveApplicationStepDataToBackend,
  updateEditApplicationData,
} from '../../../../redux/ApplicationAction';
import { NUMBER_REGEX } from '../../../../../../constants/RegexConstants';

export const applicationCreditStepValidations = async (dispatch, data, editApplicationData) => {
  const errors = {};
  let validated = true;

  if (
    data?.isExtendedPaymentTerms &&
    (!data?.extendedPaymentTermsDetails || data?.extendedPaymentTermsDetails?.trim()?.length <= 0)
  ) {
    errors.extendedPaymentTermsDetails = 'Please provide details';
    validated = false;
  }
  if (
    data?.isPassedOverdueAmount &&
    (!data?.passedOverdueDetails || data?.passedOverdueDetails?.trim()?.length <= 0)
  ) {
    errors.passedOverdueDetails = 'Please provide details';
    validated = false;
  }
  if (!data?.creditLimit || data?.creditLimit?.toString()?.trim()?.length <= 0) {
    errors.creditLimit = 'Please enter credit limit amount';
    validated = false;
  } else if (!data?.creditLimit?.toString()?.match(NUMBER_REGEX)) {
    errors.creditLimit = 'Please enter valid credit limit amount';
    validated = false;
  } else if (parseInt(data?.creditLimit, 10) === 0) {
    errors.creditLimit = 'Credit limit should be greater than zero';
    validated = false;
  }

  if (validated) {
    const {
      isExtendedPaymentTerms,
      isPassedOverdueAmount,
      extendedPaymentTermsDetails,
      passedOverdueDetails,
      creditLimit,
      note,
    } = data;

    const finalData = {
      stepper: 'credit-limit',
      applicationId: editApplicationData?._id,
      entityType: editApplicationData?.company?.entityType?.value,
      isExtendedPaymentTerms: isExtendedPaymentTerms ?? false,
      extendedPaymentTermsDetails: isExtendedPaymentTerms ? extendedPaymentTermsDetails : '',
      isPassedOverdueAmount: isPassedOverdueAmount ?? false,
      passedOverdueDetails: isPassedOverdueAmount ? passedOverdueDetails : '',
      creditLimit,
      note,
    };
    try {
      await dispatch(saveApplicationStepDataToBackend(finalData));
    } catch (e) {
      /**/
    }
    validated = true;
  }
  dispatch(updateEditApplicationData('creditLimit', { errors }));
  return validated;
};
