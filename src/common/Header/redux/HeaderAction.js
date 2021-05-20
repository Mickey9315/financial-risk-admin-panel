import HeaderApiService from '../services/HeaderApiService';
import { successNotification } from '../../Toast';
import { EDIT_PROFILE_CONSTANT, HEADER_NOTIFICATION_REDUX_CONSTANTS } from './HeaderConstants';
import { LOGIN_REDUX_CONSTANTS } from '../../../screens/auth/login/redux/LoginReduxConstants';
import { displayErrors } from '../../../helpers/ErrorNotifyHelper';
import {
  startLoaderButtonOnRequest,
  stopLoaderButtonOnSuccessOrFail,
} from '../../LoaderButton/redux/LoaderButtonAction';

export const changePassword = async (oldPassword, newPassword) => {
  try {
    startLoaderButtonOnRequest('changePasswordHeaderButtonLoaderAction');
    const data = { oldPassword, newPassword };
    const response = await HeaderApiService.changePassword(data);

    if (response?.data?.status === 'SUCCESS') {
      successNotification(response?.data?.message || 'Password changed successfully.');
      stopLoaderButtonOnSuccessOrFail('changePasswordHeaderButtonLoaderAction');
    }
  } catch (e) {
    stopLoaderButtonOnSuccessOrFail('changePasswordHeaderButtonLoaderAction');
    displayErrors(e);
    throw Error();
  }
};

export const getLoggedUserDetails = () => {
  return async dispatch => {
    try {
      const response = await HeaderApiService.loggedUserDetails();
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: EDIT_PROFILE_CONSTANT.GET_LOGGED_USER_DETAILS,
          data: response.data.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const changeEditProfileData = data => {
  return async dispatch => {
    dispatch({
      type: EDIT_PROFILE_CONSTANT.USER_EDIT_PROFILE_DATA_CHANGE,
      data,
    });
  };
};

export const updateUserProfile = (name, contactNumber) => {
  return async dispatch => {
    startLoaderButtonOnRequest('updateProfileHeaderButtonLoaderAction');
    try {
      const data = {
        name,
        contactNumber,
      };
      const response = await HeaderApiService.updateUserProfile(data);
      if (response?.data?.status === 'SUCCESS') {
        successNotification(response?.data?.message || 'Profile updated successfully');
        dispatch(getLoggedUserDetails());
        stopLoaderButtonOnSuccessOrFail('updateProfileHeaderButtonLoaderAction');
      }
    } catch (e) {
      stopLoaderButtonOnSuccessOrFail('updateProfileHeaderButtonLoaderAction');
      displayErrors(e);
      throw Error();
    }
  };
};
export const uploadProfilePicture = (data, config) => {
  return async dispatch => {
    try {
      startLoaderButtonOnRequest('updateProfileHeaderButtonLoaderAction');

      const response = await HeaderApiService.uploadUserProfilePicture(data, config);
      if (response?.data?.status === 'success') {
        dispatch({
          type: EDIT_PROFILE_CONSTANT.UPDATE_USER_PROFILE_PICTURE,
          data: response.data.data,
        });
        successNotification(response?.data?.message || 'Profile picture updated successfully');
        stopLoaderButtonOnSuccessOrFail('updateProfileHeaderButtonLoaderAction');
      }
    } catch (e) {
      stopLoaderButtonOnSuccessOrFail('updateProfileHeaderButtonLoaderAction');
      displayErrors(e);
      throw Error();
    }
  };
};
export const logoutUser = () => {
  return async dispatch => {
    try {
      startLoaderButtonOnRequest('logoutHeaderButtonLoaderAction');

      const response = await HeaderApiService.logoutUser();

      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: LOGIN_REDUX_CONSTANTS.LOGOUT_USER_ACTION,
        });
        successNotification(response?.data?.message || 'Logged out successfully.');
        stopLoaderButtonOnSuccessOrFail('logoutHeaderButtonLoaderAction');
      }
    } catch (e) {
      stopLoaderButtonOnSuccessOrFail('logoutHeaderButtonLoaderAction');
      displayErrors(e);
    }
  };
};

export const getHeaderNotificationListURL = () => {
  return async dispatch => {
    try {
      const response = await HeaderApiService.notificationApiServices.getHeaderNotificationList();
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: HEADER_NOTIFICATION_REDUX_CONSTANTS.GET_HEADER_NOTIFICATION,
          data: response?.data?.data,
        });
      }
    } catch (e) {
      /**/
    }
  };
};

export const updateHeaderNotificationOnTaskAssignedAction = data => {
  return dispatch => {
    dispatch({
      type: HEADER_NOTIFICATION_REDUX_CONSTANTS.TASK_ASSIGNED,
      data,
    });
  };
};

export const updateHeaderNotificationOnTaskUpdatedAction = data => {
  return dispatch => {
    dispatch({
      type: HEADER_NOTIFICATION_REDUX_CONSTANTS.TASK_UPDATED,
      data,
    });
  };
};

export const markNotificationAsReadAndDeleteAction = notificationId => {
  return async dispatch => {
    try {
      const response = await HeaderApiService.notificationApiServices.markNotificationAsReadAndDelete(
        notificationId
      );
      if (response?.data?.status === 'SUCCESS') {
        successNotification(response?.data?.message ?? 'Notification deleted successfully');
        dispatch({
          type: HEADER_NOTIFICATION_REDUX_CONSTANTS.TASK_DELETED_READ,
          id: notificationId,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};
