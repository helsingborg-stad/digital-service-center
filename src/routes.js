import React from 'react';
import { Router, Route, browserHistory, IndexRedirect, IndexRoute } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import { activeLanguage } from './actions/activeLanguage';

import App from './components/App';
import Startpage from './components/Startpage';
import LandingPage from './components/LandingPage';
import EventsPage from './components/EventsPage';

const setLanguageAndRedirectIfNecessary = (nextState, replace, store, defaultLanguage) => {
  if (!nextState.params.lang) {
    const redirectPath = defaultLanguage + nextState.location.pathname;
    replace({ pathname: redirectPath });
  }
  if (store) {
    store.dispatch(activeLanguage(nextState.params.lang));
  }
};

const Routes = (props = {}) => {
  let history = browserHistory;

  if (props.store) {
    history = syncHistoryWithStore(browserHistory, props.store);
  }
  const defaultLanguage = props.store
    ? props.store.getState().siteSettings.languages.find(l => l.isDefault).shortName
    : 'sv';

  return (
    <Router history={history} onUpdate={props.onUpdate}>
      <Route path='/:lang' component={App} onEnter={(nextState, replace) => {
        setLanguageAndRedirectIfNecessary(nextState, replace, props.store, defaultLanguage);
      }}>
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
          component={({params, location}) => (
            <EventsPage activeEvent={params.event} selectedTimeSpan={location.query.selectedTimeSpan} />
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
