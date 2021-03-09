import { errorNotification } from '../../../../../../common/Toast';

export const applicationCompanyStepValidations = data => {
  let validated = false;
  if (!data.abn || data.abn.trim().length <= 0) {
    errorNotification('Please select abn');
  } else if (!data.entityName || data.entityName.trim().length <= 0) {
    errorNotification('Please select entity name');
  } else if (!data.entityType || data.entityType.length <= 0) {
    errorNotification('Please select entity type');
  } else {
    validated = true;
  }
  return validated;
};
