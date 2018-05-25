import PropTypes from 'prop-types';
import React from 'react';

/* eslint-disable max-len */
const NlFlag = ({className}) => {
  return (
    <svg className={className} viewBox='0 0 640 480' width="43" height="30">
      <g fillRule="evenodd" strokeWidth="1pt" transform="scale(1.25 .9375)">
        <rect width="512" height="509.8" fill="#fff" rx="0" ry="0"/>
        <rect width="512" height="169.9" y="342.1" fill="#21468b" rx="0" ry="0"/>
        <path fill="#ae1c28" d="M0 0h512v170H0z"/>
      </g>
    </svg>
  );
};

NlFlag.propTypes = {
  className: PropTypes.string
};

NlFlag.defaultProps = {
  className: ''
};

export default NlFlag;
