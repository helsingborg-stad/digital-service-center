import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';

import Startpage from './components/Startpage';
import StandardPage from './components/StandardPage';

const SecretPath = () => <div>Secret path oh yes!</div>;

const NotFound = () => <div><h1>404!</h1><h2>Nu har du skrivit fel :(</h2></div>;

const Routes = () => (
  <Router>
  <Switch>
      <Route exact path="/" component={Startpage} />
      <Route path="/secret" component={SecretPath} />
      <Route path="/standard" component={StandardPage} />
      <Route component={NotFound} />
  </Switch>
  </Router>
);

export default Routes;
