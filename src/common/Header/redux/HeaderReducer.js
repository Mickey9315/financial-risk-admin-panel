import { EDIT_PROFILE_CONSTANT } from './HeaderConstants';

export const loggedUserProfile = (state = { changed: false }, action) => {
  switch (action.type) {
    case EDIT_PROFILE_CONSTANT.GET_LOGGED_USER_DETAILS:
      return { ...action.data, changed: false };
    case EDIT_PROFILE_CONSTANT.USER_EDIT_PROFILE_DATA_CHANGE:
      return {
        ...state,
        changed: true,
        [`${action.data.name}`]: action.data.value,
      };
    case EDIT_PROFILE_CONSTANT.UPDATE_USER_PROFILE_PICTURE:
      return { ...state, profilePictureUrl: action.data };
    default:
      return state;
  }
};
