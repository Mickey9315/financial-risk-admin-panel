import {
  saveApplicationStepDataToBackend,
  updateEditApplicationData,
} from '../../../../redux/ApplicationAction';
import { NUMBER_REGEX, SPECIAL_CHARACTER_REGEX } from '../../../../../../constants/RegexConstants';

export const applicationCompanyStepValidations = async (dispatch, data, editApplicationData) => {
  const errors = {};
  let validated = true;

  if (data?.country?.value === 'AUS' || data?.country?.value === 'NZL') {
    if (!data?.abn || data?.abn?.trim()?.length <= 0) {
      validated = false;
      errors.abn = 'Please enter ABN number before continue';
    }
    if (data?.abn && (!NUMBER_REGEX.test(data?.abn) || data?.abn?.trim()?.length !== 11)) {
      validated = false;
      errors.abn = 'Please enter valid ABN number';
    }
    if (data?.acn && (!NUMBER_REGEX.test(data?.acn) || data?.acn?.trim()?.length !== 9)) {
      validated = false;
      errors.acn = 'Please enter valid ACN number';
    }
  } else if (!data?.registrationNumber || data?.registrationNumber?.trim().length <= 0) {
    validated = false;
    errors.registrationNumber = 'Please enter registration number before continue';
  } else if (
    data?.registrationNumber &&
    (data?.registrationNumber?.length <= 5 || data?.registrationNumber?.length >= 30)
  ) {
    validated = false;
    errors.registrationNumber = 'Please enter valid registration number';
  }
  if (
    !data?.entityName ||
    data?.entityName?.length <= 0 ||
    data?.entityName?.value?.trim()?.length <= 0
  ) {
    validated = false;
    errors.entityName = 'Please enter entity name before continue';
  }
  if (!data?.entityType || data?.entityType?.length <= 0) {
    validated = false;
    errors.entityType = 'Please select entity type before continue';
  }
  if (!data?.country || data?.country?.length <= 0) {
    validated = false;
    errors.country = 'Please select country before continue';
  }
  if (data?.streetNumber && !NUMBER_REGEX.test(data?.streetNumber)) {
    validated = false;
    errors.streetNumber = 'Street number should be number';
  }
  if (!data?.state || data?.state?.length <= 0) {
    validated = false;
    if (data?.country?.value === 'AUS' || data?.country?.value === 'NZL') {
      errors.state = 'Please select state before continue';
    } else {
      errors.state = 'Please enter state before continue';
    }
  }
  if (
    !['AUS', 'NZL'].includes(data?.country?.value) &&
    data?.state &&
    !data.state.value &&
    SPECIAL_CHARACTER_REGEX.test(data?.state)
  ) {
    validated = false;
    errors.state = 'Please enter valid state';
  }
  if (
    data?.state?.value &&
    !['AUS', 'NZL'].includes(data?.country?.value) &&
    SPECIAL_CHARACTER_REGEX.test(data?.state.value)
  ) {
    validated = false;
    errors.state = 'Please enter valid state';
  }
  if (!data?.postCode || data?.postCode?.length <= 0) {
    validated = false;
    errors.postCode = 'Please enter post code before continue';
  }
  if (data?.postCode && !NUMBER_REGEX.test(data?.postCode)) {
    validated = false;
    errors.postCode = 'Post code should be number';
  }
  if (data?.phoneNumber && !NUMBER_REGEX.test(data?.phoneNumber)) {
    validated = false;
    errors.phoneNumber = 'Phone number should be number';
  }
  if (validated) {
    const {
      clientId,
      postCode,
      state,
      suburb,
      streetType,
      streetName,
      streetNumber,
      unitNumber,
      property,
      entityType,
      phoneNumber,
      entityName,
      acn,
      abn,
      tradingName,
      outstandingAmount,
      debtorId,
      country,
      isActive,
      registrationNumber,
      wipeOutDetails,
    } = data;

    delete country?.name;

    const finalData = {
      stepper: 'company',
      clientId: clientId?.value,
      debtorId: debtorId?.value,
      isActive: typeof isActive === 'string' ? isActive === 'Active' : isActive,
      entityName: entityName?.label,
      tradingName,
      contactNumber: phoneNumber,
      outstandingAmount,
      entityType: entityType?.value,
      wipeOutDetails,
      address: {
        property: property?.trim()?.length > 0 ? property : undefined,
        unitNumber: unitNumber?.trim()?.length > 0 ? unitNumber : undefined,
        streetNumber,
        streetName: streetName?.trim()?.length > 0 ? streetName : undefined,
        streetType: streetType?.value?.trim()?.length > 0 ? streetType?.value : undefined,
        suburb: suburb?.trim()?.length > 0 ? suburb : undefined,
        state: state.value ?? state,
        country: { name: country?.label, code: country?.value },
        postCode,
      },
      applicationId: editApplicationData?._id ?? '',
    };
    if (data?.country?.value === 'AUS' || data?.country?.value === 'NZL') {
      finalData.abn = abn ?? '';
      finalData.acn = acn ?? '';
    } else {
      finalData.registrationNumber = registrationNumber ?? '';
    }

    try {
      await dispatch(saveApplicationStepDataToBackend(finalData));
      validated = true;
    } catch (e) {
      validated = false;
      throw Error();
    }
  }
  dispatch(updateEditApplicationData('company', { errors }));
  return validated;
};
