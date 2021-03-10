import { Provider } from 'react-redux';
import Notifications from 'react-notify-toast';
import ReactTooltip from 'react-tooltip';
import { store } from './redux/store';
import Routes from './routes/Routes';

function App() {
  return (
    <Provider store={store}>
      <Notifications />
      <Routes />
      <ReactTooltip />
    </Provider>
  );
}

export default App;
