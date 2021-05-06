import {
  addNewStakeHolder,
  updateStakeHolder,
  updateStakeHolderDetail,
} from '../../redux/DebtorsAction';

export const stakeHolderValidation = (dispatch, data, debtorData, callBack, isEdit) => {
  let validated = true;
  const errors = {};
  let preparedData = {};
  if (data?.type === 'company') {
    if (!data?.abn || data?.abn?.trim()?.length <= 0) {
      validated = false;
      errors.abn = 'Please enter ABN number before continue';
    }
    if (data?.abn && data?.abn?.trim()?.length < 11) {
      validated = false;
      errors.abn = 'Please enter valid ABN number before continue';
    }
    if (data?.acn && data?.acn?.trim()?.length < 9) {
      validated = false;
      errors.acn = 'Please enter valid ACN number before continue';
    }
    if (!data?.entityName || data?.entityName?.length <= 0) {
      validated = false;
      errors.entityName = 'Please enter entity name';
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
    if (!data?.lastName || data?.lastName?.trim()?.length <= 0) {
      validated = false;
      errors.lastName = 'Please enter lastname before continue';
    }
    if (!data?.state || data?.state?.length <= 0) {
      validated = false;
      errors.state = 'Please select state before continue';
    }
    if (!data?.country || data?.country?.length <= 0) {
      validated = false;
      errors.country = 'Please select country before continue';
    }
    if (!data?.dateOfBirth || data?.dateOfBirth?.length <= 0) {
      validated = false;
      errors.dateOfBirth = 'Please select date of birth before continue';
    }
    if (!data?.driverLicenceNumber || data?.driverLicenceNumber?.length <= 0) {
      validated = false;
      errors.driverLicenceNumber = 'Please enter driver licence number before continue';
    }
    if (!data?.streetNumber || data?.streetNumber?.length <= 0) {
      validated = false;
      errors.streetNumber = 'Please select street number before continue';
    }
    // eslint-disable-next-line no-restricted-globals
    if (data?.streetNumber && isNaN(data?.streetNumber)) {
      validated = false;
      errors.streetNumber = 'Street number should be number';
    }
    if (!data?.streetName || data?.streetName?.length <= 0) {
      validated = false;
      errors.streetName = 'Please enter street name before continue';
    }
    if (!data?.streetType || data?.streetType?.length <= 0) {
      validated = false;
      errors.streetType = 'Please select street type before continue';
    }
    if (!data?.state || data?.state?.length <= 0) {
      validated = false;
      errors.state = 'Please select state before continue';
    }
    if (!data?.suburb || data?.suburb?.length <= 0) {
      validated = false;
      errors.suburb = 'Please enter suburb before continue';
    }
    if (!data?.postCode || data?.postCode?.trim()?.length <= 0) {
      validated = false;
      errors.postCode = 'Please enter postcode before continue';
    }
    // eslint-disable-next-line no-restricted-globals
    if (data?.postCode && isNaN(data?.postCode)) {
      validated = false;
      errors.postCode = 'Postcode should be number';
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
      title: title?.value,
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
        dispatch(updateStakeHolder(debtorId, data?._id, finalData, callBack));
      } else {
        dispatch(addNewStakeHolder(debtorId, finalData, callBack));
      }
    } catch {
      /**/
    }
  }

  return validated;
};
