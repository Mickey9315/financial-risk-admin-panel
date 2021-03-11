import AuthApiService from '../../services/AuthApiService';
import { errorNotification, successNotification } from '../../../../common/Toast';

export const setPassword = async (token, password, cb) => {
  try {
    const data = { token, password };
    console.log('data : ', data);
    const response = await AuthApiService.setPassword(data);

    if (response.data.status === 'SUCCESS') {
      successNotification('Password set successfully.');
      if (cb) {
        cb();
      }
    }
  } catch (e) {
    if (e.response.data.status === undefined) {
      errorNotification('It seems like server is down, Please try again later.');
    } else if (e.response.data.status === 'INTERNAL_SERVER_ERROR') {
      errorNotification('Internal server error');
    } else {
      errorNotification('It seems like server is down, Please try again later.');
    }
  }
  throw Error();
};
