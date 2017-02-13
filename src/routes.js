import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import Startpage from './components/Startpage';
import StandardPage from './components/StandardPage';

const SecretPath = () => <div>Secret path oh yes!</div>;

const NotFound = () => <div><h1>404!</h1><h2>Nu har du skrivit fel :(</h2></div>;

export default class Routes extends React.Component {
  render() {
    return (
      <Router>
        <Route render={({ location }) => (
          <ReactCSSTransitionGroup
            transitionName='pageChange'
            transitionEnterTimeout={750}
            transitionLeaveTimeout={500}
          >
            <Switch key={location.key}>
              <Route exact path="/" component={Startpage} />
              <Route path="/secret" component={SecretPath} />
              <Route path="/standard" component={StandardPage} />
              <Route component={NotFound} />
            </Switch>
          </ReactCSSTransitionGroup>
        )} />
      </Router>
    );
  }
};
