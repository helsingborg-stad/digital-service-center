import React from 'react';
import { Router, Route, browserHistory, IndexRedirect, IndexRoute } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import App from './components/App';
import Startpage from './components/Startpage';
import LandingPage from './components/LandingPage';

const Routes = (props = {}) => {
  let history = browserHistory;

  if (props.store) {
    history = syncHistoryWithStore(browserHistory, props.store);
  }

  return (
    <Router history={history}>
      <Route path='/' component={App}>
        <IndexRoute component={Startpage} />
        <Route
          path='visitor/category(/:category)'
          component={() => <LandingPage type='visitor' bgColor='#c70d53' />} />
        <Route
          path='visitor(/:event)'
          component={({params}) => (
            <LandingPage type='visitor' bgColor='#c70d53' activeEvent={params.event} />
          )} />
        <Route
          path='local/category/:event'
          component={() => <LandingPage type='local' bgColor='#ea671f' />} />
        <Route
          path='local(/:event)'
          component={({params}) => (
            <LandingPage type='local' bgColor='#ea671f' activeEvent={params.event} />
          )} />
      </Route>
      <Route path='*'>
        <IndexRedirect to='/' />
      </Route>
    </Router>
  );
};

Routes.propTypes = {
  store: React.PropTypes.object
};

export default Routes;
