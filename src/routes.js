import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { Router, Route, browserHistory, IndexRedirect, IndexRoute } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import Startpage from './components/Startpage.js';
import LandingPage from './components/LandingPage.js';

const App = ({ children, location }) => (
  <div>
    <ReactCSSTransitionGroup
      component='div'
      transitionName='pageChange'
      transitionEnterTimeout={600}
      transitionLeaveTimeout={600}
    >
      {React.cloneElement(children, {
        key: location.pathname
      })}
    </ReactCSSTransitionGroup>
  </div>
);

App.propTypes = {
  children: React.PropTypes.oneOfType([
    React.PropTypes.arrayOf(React.PropTypes.node),
    React.PropTypes.node
  ]),
  location: React.PropTypes.object
};


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
