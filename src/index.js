import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import './index.css';

import configureStore from './store/configureStore';
import Routes from './routes';

// eslint-disable-next-line no-underscore-dangle
const initialState = window.__REDUX_STATE__ || {};

// eslint-disable-next-line no-underscore-dangle
delete window.__REDUX_STATE__;

const store = configureStore(initialState);

// Replace all calls to /api/ to the WordPress back-end,
// when in development mode (this won't get included when building,
// since the if statement evaluates to false)
if (process.env.NODE_ENV === 'development') {
  const fetchIntercept = require('fetch-intercept');
  fetchIntercept.register({
    request: (url, config) => {
      let newUrl = url;
      if (url.startsWith('/api/')) {
        newUrl = 'http://helsingborg-dsc.local/wp-json/wp/v2/' + newUrl.slice('/api/'.length);
      }
      return [newUrl, config];
    }
  });
}

ReactDOM.render(
  <Provider store={store}>
    <Routes store={store} />
  </Provider>,
  document.getElementById('root')
);
