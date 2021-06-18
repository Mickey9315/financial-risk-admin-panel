import socketIOClient from 'socket.io-client';
import { displayErrors } from './ErrorNotifyHelper';
import { HEADER_NOTIFICATION_REDUX_CONSTANTS } from '../common/Header/redux/HeaderConstants';
import { updateHeaderNotificationOnNewNotificationAction } from '../common/Header/redux/HeaderAction';
import { store } from '../redux/store';

const urls = {
  dev: 'https://client.trad.dev.gradlesol.com',
  test: 'https://client.trad.test.humanpixel.com.au',
};

const SOCKET_URI = urls.dev;
const TYPE = 'user';
let socket = null;

export const dispatchActionsOnSocketEvents = data => {
  if (
    data.type === HEADER_NOTIFICATION_REDUX_CONSTANTS.TASK_ASSIGNED ||
    HEADER_NOTIFICATION_REDUX_CONSTANTS.TASK_UPDATED ||
    HEADER_NOTIFICATION_REDUX_CONSTANTS.REVIEW_DEBTOR
  )
    store.dispatch(updateHeaderNotificationOnNewNotificationAction(data?.data));
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
