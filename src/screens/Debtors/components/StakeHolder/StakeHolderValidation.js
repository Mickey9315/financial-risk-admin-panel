import {
  addNewStakeHolder,
  updateStakeHolder,
  updateStakeHolderDetail,
} from '../../redux/DebtorsAction';
import {
  EMAIL_ADDRESS_REGEX,
  NUMBER_REGEX,
  SPECIAL_CHARACTER_REGEX,
} from '../../../../constants/RegexConstants';

export const stakeHolderValidation = async (dispatch, data, debtorData, callBack, isEdit) => {
  let validated = true;
  const errors = {};
  let preparedData = {};
  if (data?.type === 'company') {
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
  }
  if (data?.type === 'individual') {
    if (!data?.title || data?.title?.length <= 0) {
      validated = false;
      errors.title = 'Please select title before continue';
    }
    if (!data?.firstName || data?.firstName?.trim()?.length <= 0) {
      validated = false;
      errors.firstName = 'Please enter firstname before continue';
    }
    if (data?.firstName && SPECIAL_CHARACTER_REGEX.test(data?.firstName)) {
      validated = false;
      errors.firstName = 'Please enter valid firstname';
    }
    if (!data?.lastName || data?.lastName?.trim()?.length <= 0) {
      validated = false;
      errors.lastName = 'Please enter lastname before continue';
    }
    if (data?.lastName && SPECIAL_CHARACTER_REGEX.test(data?.lastName)) {
      validated = false;
      errors.lastName = 'Please enter valid lastname';
    }
    if (!data?.state || data?.state?.length <= 0) {
      validated = false;
      if (data?.country?.value === 'AUS' || data?.country?.value === 'NZL') {
        errors.state = 'Please select state before continue';
      } else {
        errors.state = 'Please enter state before continue';
      }
    }
    if (data?.state && SPECIAL_CHARACTER_REGEX.test(data?.state?.value)) {
      validated = false;
      errors.state = 'Please enter valid state';
    }
    if (!data?.country || data?.country?.length <= 0) {
      validated = false;
      errors.country = 'Please select country before continue';
    }
    if (!data?.dateOfBirth || data?.dateOfBirth?.length <= 0) {
      validated = false;
      errors.dateOfBirth = 'Please select date of birth before continue';
    }
    if (!data?.driverLicenceNumber || data?.driverLicenceNumber?.trim()?.length <= 0) {
      validated = false;
      errors.driverLicenceNumber = 'Please enter driver licence number before continue';
    }
    if (data?.driverLicenceNumber && !NUMBER_REGEX.test(data?.driverLicenceNumber)) {
      validated = false;
      errors.driverLicenceNumber = 'Please enter driver valid licence number';
    }
    if (!data?.streetNumber || data?.streetNumber?.length <= 0) {
      validated = false;
      errors.streetNumber = 'Please enter street number before continue';
    }
    if (data?.streetNumber && !NUMBER_REGEX.test(data?.streetNumber)) {
      validated = false;
      errors.streetNumber = 'Street number should be number';
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
    if (data?.email && !EMAIL_ADDRESS_REGEX.test(data?.email)) {
      validated = false;
      errors.email = 'Please enter valid email address';
    }
  }
  if (data?.type === 'company' && validated) {
    const { type, abn, acn, entityType, entityName, tradingName } = data;
    preparedData = {
      type,
      abn,
      acn,
      entityType: entityType?.value,
      entityName: entityName?.value,
      tradingName,
    };
  } else if (data?.type === 'individual' && validated) {
    const {
      type,
      title,
      firstName,
      middleName,
      lastName,
      dateOfBirth,
      driverLicenceNumber,
      phoneNumber,
      mobileNumber,
      email,
      property,
      unitNumber,
      streetNumber,
      streetName,
      streetType,
      suburb,
      state,
      country,
      postCode,
      allowToCheckCreditHistory,
    } = data;
    delete country?.name;

    preparedData = {
      type,
      title,
      firstName,
      middleName,
      lastName,
      dateOfBirth,
      driverLicenceNumber,
      phoneNumber,
      mobileNumber,
      email,
      address: {
        property,
        unitNumber,
        streetNumber,
        streetName,
        streetType: streetType?.value,
        suburb,
        state: state?.value ?? state,
        country: { name: country?.label, code: country?.value },
        postCode,
      },
      allowToCheckCreditHistory,
    };
  }
  dispatch(updateStakeHolderDetail('errors', errors));

  if (validated) {
    const debtorId = debtorData?._id;
    const finalData = { ...preparedData };
    try {
      validated = true;
      if (isEdit) {
        await dispatch(updateStakeHolder(debtorId, data?._id, finalData, callBack));
      } else {
        await dispatch(addNewStakeHolder(debtorId, finalData, callBack));
      }
    } catch {
      /**/
    }
  }

  return validated;
};
