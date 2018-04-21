import PropTypes from 'prop-types';
import React from 'react';
import { Router, Route, browserHistory, IndexRedirect, IndexRoute } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import { activeLanguage } from './actions/activeLanguage';
import { previousUrl } from './actions/previousUrl';

import App from './components/App';
import Startpage from './components/StartPage/Startpage';
import LandingPage from './components/LandingPage/LandingPage';
import EventsPage from './components/EventsPage/EventsPage';

const setLanguageAndRedirectIfNecessary = (nextState, replace, store, defaultLanguage) => {
  if (!nextState.params.lang) {
    const redirectPath = defaultLanguage + nextState.location.pathname;
    replace({ pathname: redirectPath });
  }
  if (store) {
    store.dispatch(activeLanguage(nextState.params.lang));
  }
};

const setPreviousUrl = (nextState, store) => {
  if (store) {
    store.dispatch(previousUrl(nextState.location.pathname));
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
      }}
      onLeave={(nextState) => {
        setPreviousUrl(nextState, props.store);
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
            <EventsPage
              activeEvent={params.event}
              selectedTimeSpan={location.query.selectedTimeSpan} />
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
  store: PropTypes.object,
  onUpdate: PropTypes.func
};

export default Routes;
