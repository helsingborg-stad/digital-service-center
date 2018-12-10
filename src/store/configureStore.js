import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from '../reducers';
import portraitModeDispatcher from './portaitModeDispatcher';

export default function configureStore() {
  const persistedReducer = persistReducer({key: 'hdsc', storage}, rootReducer);
  const store = createStore(
    persistedReducer,
    {},
    composeWithDevTools(
      applyMiddleware(thunk)
    )
  );

  portraitModeDispatcher(store);

  const persistor = persistStore(store);

  return { store, persistor };
}
