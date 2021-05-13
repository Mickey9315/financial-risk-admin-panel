import { errorNotification } from '../../../../../../common/Toast';
import {
  saveApplicationStepDataToBackend,
  updatePersonData,
} from '../../../../redux/ApplicationAction';

export const applicationPersonStepValidation = (dispatch, data, editApplicationData) => {
  let validated = true;
  const partners = data?.map((item, index) => {
    const errors = {};
    const { type, isDisabled } = item;
    let preparedData = {};
    if (!isDisabled) {
      if (type === 'company') {
        if (!item?.abn || item?.abn?.trim()?.length <= 0) {
          validated = false;
          errors.abn = 'Please enter ABN number before continue';
        }
        if (item?.abn && item?.abn?.trim()?.length !== 11 && Number.isNaN(item?.abn)) {
          validated = false;
          errors.abn = 'Please enter valid ABN number before continue';
        }
        if (item?.acn && item?.acn?.trim()?.length !== 9 && Number.isNaN(item?.acn)) {
          validated = false;
          errors.acn = 'Please enter valid ACN number before continue';
        }
        if (!item?.entityName || item?.entityName?.length <= 0) {
          validated = false;
          errors.entityName = 'Please enter entity name';
        }
        if (!item?.entityType || item?.entityType?.length <= 0) {
          validated = false;
          errors.entityType = 'Please select entity type before continue';
        }
      }
      if (type === 'individual') {
        if (!item?.title || item?.title?.length <= 0) {
          validated = false;
          errors.title = 'Please select title before continue';
        }
        if (!item?.firstName || item?.firstName?.trim()?.length <= 0) {
          validated = false;
          errors.firstName = 'Please enter firstname before continue';
        }
        if (!item?.lastName || item?.lastName?.trim()?.length <= 0) {
          validated = false;
          // errorNotification('Please enter lastname before continue');
          errors.lastName = 'Please enter lastname before continue';
        }
        if (!item?.state || item?.state?.length <= 0) {
          validated = false;
          errors.state = 'Please select state before continue';
        }
        if (!item?.country || item?.country?.length <= 0) {
          validated = false;
          errors.country = 'Please select country before continue';
        }
        if (!item?.dateOfBirth || item?.dateOfBirth?.length <= 0) {
          validated = false;
          errors.dateOfBirth = 'Please select date of birth before continue';
        }
        if (!item?.driverLicenceNumber || item?.driverLicenceNumber?.length <= 0) {
          validated = false;
          errors.driverLicenceNumber = 'Please enter driver licence number before continue';
        }
        if (!item?.streetNumber || item?.streetNumber?.length <= 0) {
          validated = false;
          errors.streetNumber = 'Please select street number before continue';
        }
        // eslint-disable-next-line no-restricted-globals
        if (item?.streetNumber && isNaN(item?.streetNumber)) {
          validated = false;
          errors.streetNumber = 'Street number should be number';
        }
        if (!item?.streetName || item?.streetName?.length <= 0) {
          validated = false;
          errors.streetName = 'Please enter street name before continue';
        }
        if (!item?.streetType || item?.streetType?.length <= 0) {
          validated = false;
          errors.streetType = 'Please select street type before continue';
        }
        if (!item?.state || item?.state?.length <= 0) {
          validated = false;
          errors.state = 'Please select state before continue';
        }
        if (!item?.suburb || item?.suburb?.length <= 0) {
          validated = false;
          errors.suburb = 'Please enter suburb before continue';
        }
        if (!item?.postCode || item?.postCode?.trim()?.length <= 0) {
          validated = false;
          errors.postCode = 'Please enter postcode before continue';
        }
        // eslint-disable-next-line no-restricted-globals
        if (item?.postCode && isNaN(item?.postCode)) {
          validated = false;
          errors.postCode = 'Postcode should be number';
        }
      }
    }
    if (type === 'company' && validated) {
      const { _id, abn, acn, entityType, entityName, tradingName } = item;
      preparedData = {
        _id,
        type,
        abn,
        acn,
        entityType: entityType?.value,
        entityName: entityName?.value,
        tradingName,
      };
    } else if (type === 'individual' && validated) {
      const {
        _id,
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
      } = item;
      delete country?.name;

      preparedData = {
        _id,
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
    dispatch(updatePersonData(index, 'errors', errors));

    return preparedData;
  });
  if (validated) {
    const finalData = {
      stepper: 'person',
      applicationId: editApplicationData?._id,
      entityType: editApplicationData?.company?.entityType?.value,
      partners,
    };
    try {
      if (
        editApplicationData?.company?.entityType?.value === 'PARTNERSHIP' &&
        partners?.length < 2
      ) {
        validated = false;
        errorNotification('You have to add two partners at least');
      } else if (
        editApplicationData?.company?.entityType?.value === 'SOLE_TRADER' &&
        partners?.length > 1
      ) {
        validated = false;
        errorNotification('You can only add one sole trader');
      } else {
        validated = true;
        dispatch(saveApplicationStepDataToBackend(finalData));
      }
    } catch (e) {
      /**/
    }
  } else {
    errorNotification('Please fill the details.');
  }

  return validated;
};
