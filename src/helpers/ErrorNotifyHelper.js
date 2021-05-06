import { errorNotification } from '../common/Toast';

export const displayErrors = e => {
  if (e?.message.toLocaleString() === 'timeout of 10000ms exceeded') {
    errorNotification('Request Timeout');
  } else {
    switch (e?.response?.data?.status) {
      case 'INTERNAL_SERVER_ERROR':
        errorNotification('Internal server error');
        break;
      case 'ERROR':
        errorNotification(
          e?.response?.data?.message ?? 'It seems like server is down, Please try again later.'
        );
        break;
      case 'BAD_REQUEST':
        errorNotification(e?.response?.data?.message || 'Bad request');
        break;
      default:
        throw Error('UNKNOWN_ERROR');
    }
  }
};
