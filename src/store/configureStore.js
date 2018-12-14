import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from '../reducers';
import portraitModeDispatcher from './portaitModeDispatcher';
import { fetchAll } from '../actions/fetchAll';
import subscribeToSocket from './subscribeToSocket';

const persistConfig = {
  key: 'hdsc',
  blacklist: ['startpageHasErrored', 'startpageIsLoading', 'eventsHasErrored', 'eventsAreLoading',
    'hbgSeSearch', 'iframeUrl', 'addressSearch',
    'previousUrl', 'isInPortraitMode', 'translation', 'routing'],
  storage
};

export default function configureStore() {
  const persistedReducer = persistReducer(persistConfig, rootReducer);
  const store = createStore(
    persistedReducer,
    {},
    composeWithDevTools(
      applyMiddleware(thunk)
    )
  );

  portraitModeDispatcher(store);

  const persistor = persistStore(store);

  store.subscribe(() => {
    fetchAll(store);
  });

  subscribeToSocket(store);

  return { store, persistor };
}
