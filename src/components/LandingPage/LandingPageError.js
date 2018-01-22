import PropTypes from 'prop-types';
import React from 'react';

const LandingPageError = ({reloadPage}) => (
  <div style={{minWidth: '100vh', minHeight: '100vh', background: '#333'}}>
    <div style={{color: '#fff', paddingTop: '40vh', textAlign: 'center'}}>
      <h1 style={{textTransform: 'uppercase'}}>Something went wrong</h1>
      <button
        onClick={reloadPage}
        style={{
          border: '0', textTransform: 'uppercase', fontSize: '2rem',
          fontWeight: '300', cursor: 'pointer', padding: '0.8rem 1rem',
          borderRadius: '3px', background: '#c70d53', color: '#fff'
        }}
        >
          Reload
        </button>
      </div>
  </div>
);

LandingPageError.propTypes = {
  reloadPage: PropTypes.func.isRequired
};

export default LandingPageError;