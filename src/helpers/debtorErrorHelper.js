import { errorNotification } from '../common/Toast';

export const debtorErrorHelper = response => {
  const data = {
    isModal: false,
    modalType: '',
    message: '',
    resData: {},
  };
  if (response?.messageCode === 'APPROVED_DEBTOR_ALREADY_EXISTS') {
    return {
      ...data,
      isModal: true,
      modalType: 'WARNING',
      message: response?.message,
      resData: response?.data,
    };
  }
  if (response?.data?.messageCode === 'DEBTOR_ALREADY_EXISTS') {
    return {
      ...data,
      isModal: true,
      message: response?.data?.message,
      modalType: 'ERROR',
    };
  }
  if (response?.data?.messageCode === 'NO_DATA_FOUND') {
    errorNotification(response?.data?.message || 'Error');
    return false;
  }
  return {
    ...data,
    resData: response?.data,
  };
};
