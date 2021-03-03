import { APPLICATION_REDUX_CONSTANTS } from './ApplicationReduxConstants';

const initialApplicationList = { docs: [], total: 0, limit: 0, page: 1, pages: 1, headers: [] };

export const applicationList = (state = initialApplicationList, action) => {
  switch (action.type) {
    case APPLICATION_REDUX_CONSTANTS.APPLICATION_LIST:
      return action.data;
    default:
      return state;
  }
};
