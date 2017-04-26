import React, { PropTypes } from 'react';

/* eslint-disable max-len */
const ClockIcon = ({color, className}) => {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36.156 36.1253">
      <path fill={color} d="M74.58,838.75a18.07,18.07,0,1,0,18.061,18.07A18.075,18.075,0,0,0,74.58,838.75Zm0,31.561A13.492,13.492,0,1,1,88.063,856.82,13.668,13.668,0,0,1,74.578,870.311Zm2.358-13.87-0.367-8.553a2,2,0,0,0-4,0l-0.411,9.541v0.02a2.157,2.157,0,0,0,.725,1.7l5.948,4.756a2,2,0,0,0,2.8-2.856Z" transform="translate(-56.5 -838.75)"/>
    </svg>
  );
};

ClockIcon.propTypes = {
  color: PropTypes.string,
  className: PropTypes.string
};

ClockIcon.defaultProps = {
  color: '#000',
  className: ''
};

export default ClockIcon;
