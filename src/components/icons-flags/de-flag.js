import PropTypes from 'prop-types';
import React from 'react';

/* eslint-disable max-len */
const DeFlag = ({className}) => {
  return (
    <svg className={className} viewBox='0 0 640 480' width="43" height="30">
      <path fill="#ffce00" d="M0 320h640v160H0z"/>
      <path d="M0 0h640v160H0z"/>
      <path fill="#d00" d="M0 160h640v160H0z"/>
    </svg>
  );
};

DeFlag.propTypes = {
  className: PropTypes.string
};

DeFlag.defaultProps = {
  className: ''
};

export default DeFlag;
