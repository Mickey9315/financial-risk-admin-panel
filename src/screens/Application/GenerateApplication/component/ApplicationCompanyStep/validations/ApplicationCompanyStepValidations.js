import {
  saveApplicationStepDataToBackend,
  updateEditApplicationData,
} from '../../../../redux/ApplicationAction';

export const applicationCompanyStepValidations = (dispatch, data) => {
  const errors = {};
  let validated = true;

  if (!data.abn || data.abn.trim().length <= 0) {
    validated = false;
    errors.abn = 'Please enter ABN number before continue';
  }
  if (data.abn && data.abn.trim().length < 11) {
    validated = false;
    errors.abn = 'Please enter valid ABN number before continue';
  }
  if (data.acn && data.acn.trim().length < 9) {
    validated = false;
    errors.acn = 'Please enter valid ACN number before continue';
  }
  if (!data.entityName || data.entityName.length <= 0) {
    validated = false;
    errors.entityName = 'Please enter entity name';
  }
  if (!data.entityType || data.entityType.length <= 0) {
    validated = false;
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
      outstandingAmount,
      debtor,
    } = data;

    const finalData = {
      stepper: 'company',
      clientId: client[0]?.value,
      debtorId: debtor[0]?.value,
      abn,
      acn,
      entityName: entityName[0]?.value,
      tradingName,
      contactNumber: phoneNumber,
      outstandingAmount,
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

    dispatch(saveApplicationStepDataToBackend(finalData));

    validated = true;
  }
  dispatch(updateEditApplicationData('companyStep', { errors }));
  return validated;
};
