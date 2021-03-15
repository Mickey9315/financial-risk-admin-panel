import { errorNotification } from '../../../../../../common/Toast';
import { saveApplicationStepDataToBackend } from '../../../../redux/ApplicationAction';

export const applicationCompanyStepValidations = data => {
  let validated = false;
  if (!data.abn || data.abn.trim().length <= 0) {
    errorNotification('Please enter ABN number');
  } else if (data.abn && data.abn.trim().length < 11) {
    errorNotification('Please enter valid ABN number');
  } else if (data.acn && data.acn.trim().length < 9) {
    errorNotification('Please enter valid ACN number');
  } else if (!data.entityName || data.entityName.trim().length <= 0) {
    errorNotification('Please enter entity name');
  } else if (!data.entityType || data.entityType.length <= 0) {
    errorNotification('Please select entity type');
  } else {
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
  return validated;
};
