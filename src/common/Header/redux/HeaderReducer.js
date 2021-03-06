import { EDIT_PROFILE_CONSTANT } from './HeaderConstants';

export const loggedUserProfile = (state = null, action) => {
  switch (action.type) {
    case EDIT_PROFILE_CONSTANT.GET_LOGGED_USER_DETAILS:
      return action.data;
    case EDIT_PROFILE_CONSTANT.USER_EDIT_PROFILE_DATA_CHANGE:
      return {
        ...state,
        [`${action.data.name}`]: action.data.value,
      };
    default:
      return state;
  }
};
