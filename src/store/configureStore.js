import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from '../reducers';
import { isInPortraitMode } from '../actions/isInPortraitMode';

const portraitMediaQuery = typeof window !== 'undefined'
  && window.matchMedia && window.matchMedia('(orientation: portrait)');

export default function configureStore(initialState) {
  const store = createStore(
    rootReducer,
    initialState,
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

  return store;
}
