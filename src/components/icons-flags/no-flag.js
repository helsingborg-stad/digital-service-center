import PropTypes from 'prop-types';
import React from 'react';

/* eslint-disable max-len */
const NoFlag = ({className}) => {
  return (
    <svg className={className} viewBox="0 0 640 480" width="43" height="30">
      <path fill="#ed2939" d="M0 0h640v480H0z"/>
      <path fill="#fff" d="M180 0h120v480H180z"/>
      <path fill="#fff" d="M0 180h640v120H0z"/>
      <path fill="#002664" d="M210 0h60v480h-60z"/>
      <path fill="#002664" d="M0 210h640v60H0z"/>
    </svg>
  );
};

NoFlag.propTypes = {
  className: PropTypes.string
};

NoFlag.defaultProps = {
  className: ''
};

export default NoFlag;
