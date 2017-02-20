import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { Router, Route, browserHistory, IndexRedirect, IndexRoute } from 'react-router';

import Startpage from './components/Startpage.js';
import StandardPage from './components/StandardPage.js';

const App = ({ children, location }) => (
  <div>
    <ReactCSSTransitionGroup
      component="div"
      transitionName='pageChange'
      transitionEnterTimeout={750}
      transitionLeaveTimeout={500}
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

const Routes = () => {
  return (
    <Router history={browserHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={Startpage} />
        <Route path="standard" component={StandardPage} />
      </Route>
      <Route path="*">
        <IndexRedirect to="/" />
      </Route>
    </Router>
  );
};

export default Routes;
