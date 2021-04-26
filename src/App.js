import { Provider } from 'react-redux';
import Notifications from 'react-notify-toast';
import ReactTooltip from 'react-tooltip';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStoreData, store } from './redux/store';
import Routes from './routes/Routes';

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistStoreData}>
        <Notifications />
        <Routes />
        <ReactTooltip />
      </PersistGate>
    </Provider>
  );
}

export default App;
