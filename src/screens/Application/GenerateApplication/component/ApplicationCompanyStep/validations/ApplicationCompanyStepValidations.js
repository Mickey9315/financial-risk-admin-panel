import {
  saveApplicationStepDataToBackend,
  updateEditApplicationData,
} from '../../../../redux/ApplicationAction';

export const applicationCompanyStepValidations = (dispatch, data) => {
  const errors = {};
  let validated = false;

  if (!data.abn || data.abn.trim().length <= 0) {
    errors.abn = 'Please enter ABN number before continue';
  }
  if (data.abn && data.abn.trim().length < 11) {
    errors.abn = 'Please enter valid ABN number before continue';
  }
  if (data.acn && data.acn.trim().length < 9) {
    errors.acn = 'Please enter valid ACN number before continue';
  }
  // else if (!data.entityName || data.entityName.trim().length <= 0) {
  //   errorNotification('Please enter entity name');
  // }
  if (!data.entityType || data.entityType.length <= 0) {
    errors.entityType = 'Please select entity type before continue';
  }
  if (validated) {
    const {
      client,
      postcode,
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
      debtor,
    } = data;

    const finalData = {
      stepper: 'company',
      clientId: client[0]?.value,
      debtorId: debtor[0]?.value,
      abn,
      acn,
      entityName,
      tradingName,
      contactNumber: phoneNumber,
      entityType: entityType[0]?.value,
      address: {
        property,
        unitNumber,
        streetNumber,
        streetName,
        streetType: streetType[0]?.value,
        suburb,
        state: state[0]?.value,
        country: '',
        postCode: postcode,
      },
      applicationId: '',
    };

    saveApplicationStepDataToBackend(finalData);

    validated = true;
  }
  dispatch(updateEditApplicationData('companyStep', { errors }));
  return validated;
};
