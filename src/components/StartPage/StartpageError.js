import PropTypes from 'prop-types';
import React, { Component } from 'react';

import BottomBar from '../BottomBar';

export default class StartpageError extends Component {
  render() {
    const Row = ({children}) => (
      <div className='Startpage-Row'>{children}</div>
    );
    const Column = ({children}) => (
      <div className='Startpage-Column'>{children}</div>
    );

    return (
      <div style={{background: '#333', minHeight: '100vh'}}>
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
        <BottomBar><div style={{height: '3.75rem'}} /></BottomBar>
      </div>
    );
  }
}

StartpageError.propTypes = {
  reloadPage: PropTypes.func.isRequired
};
