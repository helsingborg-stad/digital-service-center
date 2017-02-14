import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch
} from 'react-router-dom';

import Startpage from './components/Startpage';

const SecretPath = () => <div>Secret path oh yes!</div>;

const NotFound = () => <div><h1>404!</h1><h2>Nu har du skrivit fel :(</h2></div>;

const Topic = ({ match }) => (
  <div>
    <h3>{match.params.topicId}</h3>
  </div>
);

const Topics = ({ match }) => (
  <div>
    <h2>Topics</h2>
    <ul>
      <li><Link to={`${match.url}/rendering`}>Rendering with React</Link></li>
      <li><Link to={`${match.url}/components`}>Components</Link></li>
      <li><Link to={`${match.url}/props-v-state`}>Props v. State</Link></li>
    </ul>

    <Route path={`${match.url}/:topicId`} component={Topic}/>
    <Route exact path={match.url} render={() => (
      <h3>Please select a topic.</h3>
    )}/>
  </div>
);

const Routes = () => (
  <Router>
  <Switch>
      <Route exact path="/" component={Startpage} />
      <Route path="/about" component={SecretPath} />
      <Route path="/topics" component={Topics} />
      <Route component={NotFound} />
  </Switch>
  </Router>
);

export default Routes;
