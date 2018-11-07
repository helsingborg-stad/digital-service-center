import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from '../reducers';
import { isInPortraitMode } from '../actions/isInPortraitMode';

const portraitMediaQuery = typeof window !== 'undefined'
  && window.matchMedia && window.matchMedia('(orientation: portrait)');

const persistConfig = {
  key: 'hdsc',
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

  if (portraitMediaQuery) {
    store.dispatch(isInPortraitMode(portraitMediaQuery.matches));

    portraitMediaQuery.addListener((query) => {
      store.dispatch(isInPortraitMode(query.matches));
    });
  }

  const persistor = persistStore(store);

  return { store, persistor };
}
