import moment from 'moment';
import { errorNotification } from '../../common/Toast';

export const filterDateValidations = (appliedFilter, appliedParams) => {
  if(appliedFilter === 'clientList') {
    if(appliedParams?.inceptionEndDate || appliedParams?.inceptionStartDate) {
     if(moment(appliedParams?.inceptionEndDate)?.isBefore(appliedParams?.inceptionStartDate)) {
        errorNotification('Please enter valid inception date range');
       return false;
     }
    }
    
    if(appliedParams?.expiryEndDate || appliedParams?.expiryStartDate) {
     if(moment(appliedParams?.expiryEndDate)?.isBefore(appliedParams?.expiryStartDate)) {
      errorNotification('Please enter valid expiry date range');
      return false;
    }
  }

    } 

    if(appliedParams?.endDate || appliedParams?.startDate) {
      if(moment(appliedParams?.endDate)?.isBefore(appliedParams?.startDate)) {
        errorNotification('Please enter valid date range');
        return false;
      }
    }
    return true;
}