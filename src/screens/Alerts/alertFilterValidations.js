import moment from 'moment';
import { errorNotification } from '../../common/Toast';

export const filterDateValidations = (appliedParams) => {
  if (appliedParams?.endDate || appliedParams?.startDate) {
    if (moment(appliedParams?.endDate)?.isBefore(appliedParams?.startDate)) {
      errorNotification('Please enter valid date range');
      return false;
    }
  }
  return true;
}