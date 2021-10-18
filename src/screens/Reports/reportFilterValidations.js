import moment from 'moment';
import { errorNotification } from '../../common/Toast';

export const filterDateValidations = (appliedFilter, appliedParams) => {
  if(appliedFilter === 'clientList') {

     if(moment(appliedParams?.inceptionEndDate)?.isBefore(appliedParams?.inceptionStartDate)) {
        errorNotification('Please enter valid inception date range');
       return false;
     }
     if(moment(appliedParams?.expiryEndDate)?.isBefore(appliedParams?.expiryStartDate)) {
      errorNotification('Please enter valid expiry date range');
      return false;
    }

    } 

      if(moment(appliedParams?.endDate)?.isBefore(appliedParams?.startDate)) {
        errorNotification('Please enter valid date range');
        return false;
      }
    return true;
}