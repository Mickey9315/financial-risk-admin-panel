import socketIOClient from 'socket.io-client';
import { displayErrors } from './ErrorNotifyHelper';
import { HEADER_NOTIFICATION_REDUX_CONSTANTS } from '../common/Header/redux/HeaderConstants';
// eslint-disable-next-line import/no-cycle
import {
  updateHeaderNotificationOnTaskAssignedAction,
  updateHeaderNotificationOnTaskUpdatedAction,
} from '../common/Header/redux/HeaderAction';
// eslint-disable-next-line import/no-cycle
import { store } from '../redux/store';

const SOCKET_URI = 'https://client.trad.dev.gradlesol.com';
const TYPE = 'user';
let socket = null;

export const dispatchActionsOnSocketEvents = data => {
  switch (data.type) {
    case HEADER_NOTIFICATION_REDUX_CONSTANTS.TASK_ASSIGNED:
      store.dispatch(updateHeaderNotificationOnTaskAssignedAction(data?.data));
      break;
    case HEADER_NOTIFICATION_REDUX_CONSTANTS.TASK_UPDATED:
      store.dispatch(updateHeaderNotificationOnTaskUpdatedAction(data?.data));
      break;
    default:
      break;
  }
};
export const connectWebSocket = AUTH_TOKEN => {
  try {
    socket = socketIOClient(`${SOCKET_URI}?token=${AUTH_TOKEN}&type=${TYPE}`);
    if (socket !== null) {
      socket.on('connect', () => {
        socket.on('FromAPI', data => {
          dispatchActionsOnSocketEvents(data);
        });
      });
    }
  } catch (e) {
    displayErrors(e);
  }
};

export const disconnectWebSocket = () => {
  if (socket !== null) {
    socket.disconnect();
  }
};
