import { Provider } from 'react-redux';
import Notifications from 'react-notify-toast';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStoreData, store } from './redux/store';
import Routes from './routes/Routes';

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistStoreData}>
        <Notifications />
        <Routes />
      </PersistGate>
    </Provider>
  );
}

export default App;
