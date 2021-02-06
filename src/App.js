import { Provider } from 'react-redux';
import Notifications from 'react-notify-toast';
import { store } from './redux/store';
import Routes from './routes/Routes';

function App() {
  return (
    <Provider store={store}>
      <Notifications />
      <Routes />
    </Provider>
  );
}

export default App;
