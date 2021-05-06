import HeaderApiService from '../services/HeaderApiService';
import { successNotification } from '../../Toast';
import { EDIT_PROFILE_CONSTANT } from './HeaderConstants';
import { LOGIN_REDUX_CONSTANTS } from '../../../screens/auth/login/redux/LoginReduxConstants';
import { displayErrors } from '../../../helpers/ErrorNotifyHelper';

export const changePassword = async (oldPassword, newPassword) => {
  try {
    const data = { oldPassword, newPassword };
    const response = await HeaderApiService.changePassword(data);

    if (response.data.status === 'SUCCESS') {
      successNotification(response?.data?.message || 'Password changed successfully.');
    }
  } catch (e) {
    displayErrors(e);
    throw Error();
  }
};

export const getLoggedUserDetails = () => {
  return async dispatch => {
    try {
      const response = await HeaderApiService.loggedUserDetails();
      if (response.data.status === 'SUCCESS') {
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
    try {
      const data = {
        name,
        contactNumber,
      };
      const response = await HeaderApiService.updateUserProfile(data);
      if (response.data.status === 'SUCCESS') {
        successNotification(response?.data?.message || 'Profile updated successfully');
        dispatch(getLoggedUserDetails());
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};
export const uploadProfilePicture = (data, config) => {
  return async dispatch => {
    try {
      const response = await HeaderApiService.uploadUserProfilePicture(data, config);
      if (response.data.status === 'success') {
        dispatch({
          type: EDIT_PROFILE_CONSTANT.UPDATE_USER_PROFILE_PICTURE,
          data: response.data.data,
        });
        successNotification(response?.data?.message || 'Profile picture updated successfully');
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};
export const logoutUser = () => {
  return async dispatch => {
    try {
      const response = await HeaderApiService.logoutUser();

      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: LOGIN_REDUX_CONSTANTS.LOGOUT_USER_ACTION,
        });
        successNotification(response?.data?.message || 'Logged out successfully.');
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};
