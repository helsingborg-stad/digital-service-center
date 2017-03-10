import React, { Component } from 'react';

import TopBar from './TopBar';

export default class StartpageError extends Component {
  render() {
    const Row = ({children}) => (
      <div style={{display: 'flex', margin: '0 5%'}}>{children}</div>
    );
    const Column = ({children}) => (
      <div style={{flex: '1', margin: '0 1%', maxWidth: '33%'}}>{children}</div>
    );

    return (
      <div style={{background: '#333', minHeight: '100vh'}}>
        <TopBar />
        <Row>
          <Column />
          <Column>
            <div style={{color: '#fff', marginTop: '40vh', textAlign: 'center'}}>
              <h1 style={{textTransform: 'uppercase'}}>Something went wrong</h1>
              <button
                onClick={this.props.reloadPage}
                style={{
                  border: '0', textTransform: 'uppercase', fontSize: '2rem',
                  fontWeight: '300', cursor: 'pointer', padding: '0.8rem 1rem',
                  borderRadius: '3px', background: '#c70d53', color: '#fff'
                }}
              >
                Reload
              </button>
            </div>
          </Column>
          <Column />
        </Row>
      </div>
    );
  }
}

StartpageError.propTypes = {
  reloadPage: React.PropTypes.func.isRequired
};
