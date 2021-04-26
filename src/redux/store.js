import { applyMiddleware, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { persistStore } from 'redux-persist';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from './RootReducer';

export const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunkMiddleware))
);

export const persistStoreData = persistStore(store);
