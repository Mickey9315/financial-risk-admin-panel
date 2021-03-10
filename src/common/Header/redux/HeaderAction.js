import HeaderApiService from '../services/HeaderApiService';
import { errorNotification, successNotification } from '../../Toast';
import { clearAuthToken } from '../../../helpers/LocalStorageHelper';
import { EDIT_PROFILE_CONSTANT } from './HeaderConstants';

export const changePassword = async (oldPassword, newPassword) => {
  try {
    const data = { oldPassword, newPassword };
    const response = await HeaderApiService.changePassword(data);

    if (response.data.status === 'SUCCESS') {
      successNotification('Password changed successfully.');
    }
  } catch (e) {
    if (e.response && e.response.data) {
      if (e.response.data.status === undefined) {
        errorNotification('It seems like server is down, Please try again later.');
      } else if (e.response.data.status === 'INTERNAL_SERVER_ERROR') {
        errorNotification('Internal server error');
      } else if (e.response.data.status === 'ERROR') {
        if (e.response.data.messageCode) {
          switch (e.response.data.messageCode) {
            case 'WRONG_CURRENT_PASSWORD':
              errorNotification('Please enter correct current password');
              break;
            case 'SAME_OLD_PASSWORD':
              errorNotification("You can't set set last used password");
              break;
            default:
              break;
          }
        } else {
          errorNotification('It seems like server is down, Please try again later.');
        }
      }
      throw Error();
    }
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
      if (e.response && e.response.data) {
        if (e.response.data.status === undefined) {
          errorNotification('It seems like server is down, Please try again later.');
        } else if (e.response.data.status === 'INTERNAL_SERVER_ERROR') {
          errorNotification('Internal server error');
        } else if (e.response.data.status === 'ERROR') {
          errorNotification('It seems like server is down, Please try again later.');
        }
        throw Error();
      }
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

export const updateUserProfile = (name, email, contactNumber) => {
  return async dispatch => {
    try {
      const data = {
        name,
        email,
        contactNumber,
      };
      const response = await HeaderApiService.updateUserProfile(data);
      if (response.data.status === 'SUCCESS') {
        successNotification(response.data.message);
        dispatch(getLoggedUserDetails());
      }
    } catch (e) {
      if (e.response && e.response.data) {
        if (e.response.data.status === undefined) {
          errorNotification('It seems like server is down, Please try again later.');
        } else if (e.response.data.status === 'INTERNAL_SERVER_ERROR') {
          errorNotification('Internal server error');
        } else if (e.response.data.status === 'ERROR') {
          errorNotification('It seems like server is down, Please try again later.');
        }
        throw Error();
      }
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
        successNotification('Profile picture updated successfully');
      }
    } catch (e) {
      if (e.response && e.response.data) {
        if (e.response.data.status === undefined) {
          errorNotification('It seems like server is down, Please try again later.');
        } else if (e.response.data.status === 'INTERNAL_SERVER_ERROR') {
          errorNotification('Internal server error');
        } else if (e.response.data.status === 'ERROR') {
          errorNotification('It seems like server is down, Please try again later.');
        }
        throw Error();
      }
    }
  };
};
export const logoutUser = async () => {
  try {
    const response = await HeaderApiService.logoutUser();

    if (response.data.status === 'SUCCESS') {
      clearAuthToken();
      successNotification('Logged out successfully.');
    }
  } catch (e) {
    if (e.response && e.response.data) {
      if (e.response.data.status === undefined) {
        errorNotification('It seems like server is down, Please try again later.');
      } else if (e.response.data.status === 'INTERNAL_SERVER_ERROR') {
        errorNotification('Internal server error');
      } else {
        errorNotification('Please try again later.');
      }
      throw Error();
    }
  }
};
