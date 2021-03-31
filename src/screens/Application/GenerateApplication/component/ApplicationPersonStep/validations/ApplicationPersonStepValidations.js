import { errorNotification } from '../../../../../../common/Toast';
import {
  saveApplicationStepDataToBackend,
  updatePersonData,
} from '../../../../redux/ApplicationAction';

export const applicationPersonStepValidation = (dispatch, data, editApplicationData) => {
  let validated = true;
  const partners = data.map((item, index) => {
    const errors = {};
    const { type } = item;
    let preparedData = {};
    if (type === 'company') {
      if (!item.abn || item.abn.trim().length <= 0) {
        validated = false;
        // errorNotification('Please enter ABN number before continue');
        errors.abn = 'Please enter ABN number before continue';
      }
      if (item.abn && item.abn.trim().length < 11) {
        validated = false;
        // errorNotification('Please enter valid ABN number before continue');
        errors.abn = 'Please enter valid ABN number before continue';
      }
      if (item.acn && item.acn.trim().length < 9) {
        validated = false;
        // errorNotification('Please enter valid ACN number before continue');
        errors.acn = 'Please enter valid ACN number before continue';
      }
      if (!item.entityName || item.entityName.length <= 0) {
        validated = false;
        // errorNotification('Please enter entity name');
        errors.entityName = 'Please enter entity name';
      }
      if (!item.entityType || item.entityType.length <= 0) {
        validated = false;
        // errorNotification('Please select entity type before continue');
        errors.entityType = 'Please select entity type before continue';
      }
    }
    if (type === 'individual') {
      if (!item.title || item.title.length <= 0) {
        validated = false;
        // errorNotification('Please select title before continue');
        errors.title = 'Please select title before continue';
      }
      if (!item.firstName || item.firstName.trim().length <= 0) {
        validated = false;
        // errorNotification('Please enter firstname before continue');
        errors.firstName = 'Please enter firstname before continue';
      }
      if (!item.lastName || item.lastName.trim().length <= 0) {
        validated = false;
        // errorNotification('Please enter lastname before continue');
        errors.lastName = 'Please enter lastname before continue';
      }
      if (!item.postCode || item.postCode.trim().length <= 0) {
        validated = false;
        // errorNotification('Please enter postcode before continue');
        errors.postCode = 'Please enter postcode before continue';
      }
      // eslint-disable-next-line no-restricted-globals
      if (item.postCode && isNaN(item.postCode)) {
        validated = false;
        // errorNotification('Postcode should be number');
        errors.postCode = 'Postcode should be number';
      }
      if (!item.streetNumber || item.streetNumber.length <= 0) {
        validated = false;
        // errorNotification('Please select street number before continue');
        errors.streetName = 'Please select street number before continue';
      }
      // eslint-disable-next-line no-restricted-globals
      if (item.streetNumber && isNaN(item.streetNumber)) {
        validated = false;
        // errorNotification('Street number should be number');
        errors.streetName = 'Street number should be number';
      }
      if (!item.state || item.state.length <= 0) {
        validated = false;
        // errorNotification('Please select state before continue');
        errors.state = 'Please select state before continue';
      }
      if (!item.country || item.country.length <= 0) {
        validated = false;
        // errorNotification('Please select country before continue');
        errors.country = 'Please select country before continue';
      }
      if (!item.dateOfBirth || item.dateOfBirth.length <= 0) {
        validated = false;
        errorNotification('Please select date of birth before continue');
        // errors.postCode = 'Please select date of birth before continue';
      }
    }
    if (type === 'company' && validated) {
      const { abn, acn, entityType, entityName, tradingName } = item;
      preparedData = {
        type,
        abn,
        acn,
        entityType: entityType[0]?.value,
        entityName: entityName[0]?.value,
        tradingName,
      };
    } else if (type === 'individual' && validated) {
      const {
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
      delete country[0].name;

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
          streetType,
          suburb,
          state,
          country: { name: country[0].label, code: country[0].value },
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
      applicationId: editApplicationData.applicationId,
      entityType: editApplicationData.companyStep.entityType[0].value,
      partners,
    };
    try {
      dispatch(saveApplicationStepDataToBackend(finalData));
    } catch (e) {
      /**/
    }
    validated = true;
  }

  return validated;
};
