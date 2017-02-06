import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Container, Row, Column } from './components/Grid';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <Container>
          <Row>
            <Column cols={4} colsNarrow={2}>
              asdfaasda
            </Column>
            <Column cols={4} colsNarrow={2} colsWide={4}>
              asdfaasda
            </Column>
            <Column cols={4} colsWide={2}>
              asdfaasda
            </Column>
          </Row>
        </Container>
      </div>
    );
  }
}

export default App;
