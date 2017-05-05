import React from 'react';
import { Router, Route, browserHistory, IndexRedirect, IndexRoute } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import App from './components/App';
import Startpage from './components/Startpage';
import LandingPage from './components/LandingPage';
import EventsPage from './components/EventsPage';

const defaultLanguage = 'sv';
const languageRedirect = (nextState, replace) => {
  console.log(nextState.location.pathname);
  if (!nextState.location.pathname.startsWith(defaultLanguage + '/') && !nextState.location.pathname.startsWith('/' + defaultLanguage + '/')) {
    const redirectPath = defaultLanguage + nextState.location.pathname;
    replace({
      pathname: redirectPath
    });
  }
};

const Routes = (props = {}) => {
  let history = browserHistory;

  if (props.store) {
    history = syncHistoryWithStore(browserHistory, props.store);
  }

  return (
    <Router history={history} onUpdate={props.onUpdate}>
      <Route path='/:lang' component={App} onEnter={languageRedirect}>
        <IndexRoute component={Startpage} />
        <Route
          path='/:lang/visitor/category/:category'
          component={() => <LandingPage type='visitor' bgColor='#c70d53' />} />
        <Route
          path='/:lang/visitor(/:event)'
          component={({params}) => (
            <LandingPage type='visitor' bgColor='#c70d53' activeEvent={params.event} />
          )} />
        <Route
          path='/:lang/local/category/:category'
          component={() => <LandingPage type='local' bgColor='#ea671f' />} />
        <Route
          path='/:lang/local(/:event)'
          component={({params}) => (
            <LandingPage type='local' bgColor='#ea671f' activeEvent={params.event} />
          )} />
        <Route
          path='/:lang/events/category/:category'
          component={() => (
            <EventsPage />
          )} />
        <Route
          path='/:lang/events(/:event)'
          component={({params}) => (
            <EventsPage activeEvent={params.event} />
          )} />
      </Route>
      <Route path='*'>
        <IndexRedirect to={`/${defaultLanguage}/`} />
      </Route>
      <Route/>
    </Router>
  );
};

Routes.propTypes = {
  store: React.PropTypes.object,
  onUpdate: React.PropTypes.func
};

export default Routes;
