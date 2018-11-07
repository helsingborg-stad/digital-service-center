import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import ReactGA from 'react-ga';
import { hotjar } from 'react-hotjar';
import InactivityMonitor from './util/inactivityMonitor';
import FetchSiteSettings from './components/FetchSiteSettings';
import * as serviceWorker from './serviceWorker';
import './index.css';

import configureStore from './store/configureStore';
import Routes from './routes';

// Replace all calls to /api/ to the WordPress back-end,
// when in development mode (this won't get included when building,
// since the if statement evaluates to false)
if (process.env.NODE_ENV === 'development') {
  const fetchIntercept = require('fetch-intercept');
  fetchIntercept.register({
    request: (url, config) => {
      let newUrl = url;
      if (url.startsWith('/api/')) {
        newUrl = 'http://helsingborg-dsc.test/wp-json/wp/v2/' + newUrl.slice('/api/'.length);
      }
      return [newUrl, config];
    }
  });
}

function startApp(store, persistor) {
  const timeoutLength = store.getState().siteSettings && store.getState().siteSettings.idleTimeout;
  if (window && process.env.NODE_ENV !== 'development' && timeoutLength) {
    // eslint-disable-next-line no-new
    new InactivityMonitor({
      timeout: timeoutLength * 1000,
      idleAction: () => window.location.assign(window.location.origin)}
    );
  }

  const analyticsId = store.getState().siteSettings &&
    store.getState().siteSettings.googleAnalyticsId;

  if (analyticsId) {
    ReactGA.initialize(analyticsId);
  }

  hotjar.initialize(1004512, 6);

  const logPageView = analyticsId ?
    () => {
      ReactGA.set({ page: window.location.pathname });
      ReactGA.pageview(window.location.pathname);
    } : () => {};

  ReactDOM.render(
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <FetchSiteSettings
          store={store}
          render={() => (
            <Routes store={store} onUpdate={logPageView} />
          )}
        />
      </PersistGate>
    </Provider>,
    document.getElementById('root')
  );

  // Make hot reload preserve Redux state during development
  if (process.env.NODE_ENV === 'development' && module.hot) {
    module.hot.accept('./routes', () => {
      const ReloadedApp = require('./routes').default;
      ReactDOM.render(
        <Provider store={store}>
          <ReloadedApp store={store} />
        </Provider>,
        document.getElementById('root')
      );
    });
  }
}

const { store, persistor } = configureStore();
startApp(store, persistor);

serviceWorker.register();
