import PropTypes from 'prop-types';
import React from 'react';

/* eslint-disable max-len */
const ItFlag = ({className}) => {
  return (
    <svg className={className} viewBox='0 0 640 480' width="43" height="30">
      <g fillRule="evenodd" strokeWidth="1pt">
        <path fill="#fff" d="M0 0h640v480H0z"/>
        <path fill="#009246" d="M0 0h213.3v480H0z"/>
        <path fill="#ce2b37" d="M426.7 0H640v480H426.7z"/>
      </g>
    </svg>
  );
};

ItFlag.propTypes = {
  className: PropTypes.string
};

ItFlag.defaultProps = {
  className: ''
};

export default ItFlag;
