import { errorNotification } from '../../../../../../common/Toast';
import {
  saveApplicationStepDataToBackend,
  updatePersonData,
} from '../../../../redux/ApplicationAction';
import {
  EMAIL_ADDRESS_REGEX,
  NUMBER_REGEX,
  SPECIAL_CHARACTER_REGEX,
} from '../../../../../../constants/RegexConstants';

export const applicationPersonStepValidation = async (dispatch, data, editApplicationData) => {
  let validated = true;
  const partners = data?.map((item, index) => {
    const errors = {};
    const { type, isDisabled } = item;

    let preparedData = {};
    if (!isDisabled) {
      if (type === 'company') {
        if (['AUS', 'NZL'].includes(item?.stakeholderCountry?.value)) {
          if (
            (!item?.acn && editApplicationData?.company?.entityType?.value === 'TRUST') ||
            (item?.acn?.trim()?.length <= 0 &&
              editApplicationData?.company?.entityType?.value === 'TRUST')
          ) {
            validated = false;
            errors.acn = 'Please enter ACN number before continue';
          }
          if (
            (!item?.abn ||
            item?.abn?.trim()?.length <= 0) &&
            (!item?.acn ||
            item?.acn?.trim()?.length <= 0) && 
             editApplicationData?.company?.entityType?.value !== 'TRUST'
          ) {
            validated = false;
            errors.acn = 'Please enter ABN or ACN number before continue';
          }
          if (
            item?.abn &&
            (!NUMBER_REGEX.test(item?.abn) ||
              item?.abn?.trim()?.length < 11 ||
              item?.abn?.trim().length > 13)
          ) {
            validated = false;
            errors.abn = 'Please enter valid ABN number';
          }
          if (
            item?.acn &&
            (!NUMBER_REGEX.test(item?.acn) ||
              item?.acn?.trim()?.length < 5 ||
              item?.acn?.trim().length > 9)
          ) {
            validated = false;
            errors.acn = 'Please enter valid ACN number';
          }
        } else {
          if (
            !item?.registrationNumber ||
            item?.registrationNumber?.toString()?.trim()?.length <= 0
          ) {
            validated = false;
            errors.registrationNumber = 'Please enter registration number before continue';
          }
          if (
            item?.registrationNumber &&
            (item?.registrationNumber?.length <= 5 ||
              item?.registrationNumber?.toString()?.trim()?.length >= 30)
          ) {
            validated = false;
            errors.registrationNumber = 'Please enter valid registration number';
          }
        }
        if (item?.stakeholderCountry?.value === 'NZL') {
          if (!item?.acn || item?.acn?.trim()?.length <= 0) {
            validated = false;
            errors.acn = 'Please enter NCN number before continue';
          }
        }
        if (
          !item?.entityName ||
          item?.entityName?.length <= 0 ||
          item?.entityName?.value?.trim()?.length <= 0
        ) {
          validated = false;
          errors.entityName = 'Please enter entity name before continue';
        }
        if (!item?.entityType || item?.entityType?.length <= 0) {
          validated = false;
          errors.entityType = 'Please select entity type before continue';
        }
        if (!item?.stakeholderCountry || item?.stakeholderCountry?.length <= 0) {
          validated = false;
          errors.stakeholderCountry = 'Please select country before continue';
        }
      }
      if (type === 'individual') {
        if (!item?.title || item?.title?.length <= 0) {
          validated = false;
          errors.title = 'Please select title before continue';
        }
        if (!item?.firstName || item?.firstName?.trim()?.length <= 0) {
          validated = false;
          errors.firstName = 'Please enter first name before continue';
        }
        if (item?.firstName && SPECIAL_CHARACTER_REGEX.test(item?.firstName)) {
          validated = false;
          errors.firstName = 'Please enter valid first name';
        }
        if (!item?.lastName || item?.lastName?.trim()?.length <= 0) {
          validated = false;
          errors.lastName = 'Please enter last name before continue';
        }
        if (item?.lastName && SPECIAL_CHARACTER_REGEX.test(item?.lastName)) {
          validated = false;
          errors.lastName = 'Please enter valid last name';
        }
        if (!item?.state || item?.state?.length <= 0) {
          validated = false;
          if (item?.country?.value === 'AUS' || item?.country?.value === 'NZL') {
            errors.state = 'Please select state before continue';
          } else {
            errors.state = 'Please enter state before continue';
          }
        }
        if (item?.state && SPECIAL_CHARACTER_REGEX.test(item?.state?.value)) {
          validated = false;
          errors.state = 'Please enter valid state';
        }
        if (!item?.country || item?.country?.length <= 0) {
          validated = false;
          errors.country = 'Please select country before continue';
        }
        if (item?.dateOfBirth === undefined && item?.driverLicenceNumber?.toString()?.trim()?.length === 0 || 
        (item?.dateOfBirth === undefined && item?.driverLicenceNumber === undefined)) {
          validated = false;
          errors.driverLicenceNumber =
            'Please provide at least one - either a driver licence number or date of birth';
        }

        if (item?.dateOfBirthitem && item?.driverLicenceNumber?.toString().trim().length < 0) {
          validated = false;
          errors.driverLicenceNumber = 'Please enter valid driver licence number';
        }
        if (!item?.streetNumber || item?.streetNumber?.length <= 0) {
          validated = false;
          errors.streetNumber = 'Please enter street number before continue';
        }
        if (item?.streetNumber && !NUMBER_REGEX.test(item?.streetNumber)) {
          validated = false;
          errors.streetNumber = 'Street number should be number';
        }
        if (!item?.postCode || item?.postCode?.length <= 0) {
          validated = false;
          errors.postCode = 'Please enter post code before continue';
        }
        if (item?.postCode && !NUMBER_REGEX.test(item?.postCode)) {
          validated = false;
          errors.postCode = 'Post code should be number';
        }
        if (item?.phoneNumber && !NUMBER_REGEX.test(item?.phoneNumber)) {
          validated = false;
          errors.phoneNumber = 'Phone number should be number';
        }
        if (item?.email && !EMAIL_ADDRESS_REGEX.test(item?.email)) {
          validated = false;
          errors.email = 'Please enter valid email address';
        }
      }
    }
    if (type === 'company' && validated) {
      const {
        _id,
        abn,
        acn,
        entityType,
        entityName,
        tradingName,
        stakeholderCountry,
        registrationNumber,
      } = item;
      preparedData = {
        _id,
        type,
        entityType: entityType?.value,
        entityName: entityName?.label,
        tradingName,
        stakeholderCountry: { name: stakeholderCountry?.label, code: stakeholderCountry?.value },
      };
      if (['AUS', 'NZL'].includes(stakeholderCountry?.value)) {
        preparedData.abn = abn;
        preparedData.acn = acn;
      } else {
        preparedData.registrationNumber = registrationNumber;
      }
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
        firstName: firstName?.toString()?.trim(),
        middleName: middleName?.toString()?.trim(),
        lastName: lastName?.toString()?.trim(),
        dateOfBirth,
        driverLicenceNumber: driverLicenceNumber?.toString().trim(),
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
        await dispatch(saveApplicationStepDataToBackend(finalData));
      }
    } catch (e) {
      throw Error();
    } 
  } else {
    errorNotification('Please fill the details.');
  }

  return validated;
};
