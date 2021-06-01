import { errorNotification } from '../common/Toast';

export const applicationErrorHelper = response => {
  const data = {
    isModal: false,
    modalType: '',
    message: '',
    resData: {},
  };
  if (response?.messageCode === 'APPROVED_APPLICATION_ALREADY_EXISTS') {
    return {
      ...data,
      isModal: true,
      modalType: 'WARNING',
      message: response?.message,
      resData: response?.data,
    };
  }
  if (response?.data?.messageCode === 'APPLICATION_ALREADY_EXISTS') {
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
