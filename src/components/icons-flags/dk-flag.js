import PropTypes from 'prop-types';
import React from 'react';

/* eslint-disable max-len */
const DkFlag = ({className}) => {
  return (
    <svg className={className} viewBox='0 0 640 480' width="43" height="30">
      <path fill="#c60c30" d="M0 0h640.1v480H0z"/>
      <path fill="#fff" d="M205.7 0h68.6v480h-68.6z"/>
      <path fill="#fff" d="M0 205.7h640.1v68.6H0z"/>
    </svg>
  );
};

DkFlag.propTypes = {
  className: PropTypes.string
};

DkFlag.defaultProps = {
  className: ''
};

export default DkFlag;
