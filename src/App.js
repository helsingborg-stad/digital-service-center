import React, { Component } from 'react';
import './App.css';
import { Row, Column } from './components/Grid';
import Startpage from './components/Startpage';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Row>
          <Column cols={12}>
            <Startpage />
          </Column>
        </Row>
      </div>
    );
  }
}

export default App;
