import PropTypes from 'prop-types';
import React from 'react';

/* eslint-disable max-len */
const CameraIcon = ({color, className}) => {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 38.406 32.9063">
      <path fill={color} d="M91.913,647.671a2.048,2.048,0,0,0-1.659-1.527c-2.135-.232-4.271-0.4-6.4-0.546-0.323-1.02-.66-2.3-1.022-3.328a2.438,2.438,0,0,0-1.883-1.528,97.237,97.237,0,0,0-14.013,0,2.439,2.439,0,0,0-1.884,1.528c-0.36,1.031-.7,2.308-1.022,3.328-2.134.141-4.256,0.314-6.39,0.546a2.051,2.051,0,0,0-1.66,1.527c-1.8,9.249-1.736,14.378,0,23.308a2.045,2.045,0,0,0,1.66,1.527,150.474,150.474,0,0,0,32.619,0,2.049,2.049,0,0,0,1.659-1.527A60.486,60.486,0,0,0,91.913,647.671ZM73.892,669.417a11.112,11.112,0,1,1,0-22.223A11.112,11.112,0,0,1,73.892,669.417Zm-0.051-17.97a6.813,6.813,0,0,0-6.859,6.815,6.859,6.859,0,1,0,13.718,0A6.813,6.813,0,0,0,73.841,651.447Z" transform="translate(-54.656 -640.5)"/>
    </svg>
  );
};

CameraIcon.propTypes = {
  color: PropTypes.string,
  className: PropTypes.string
};

CameraIcon.defaultProps = {
  color: '#000',
  className: ''
};

export default CameraIcon;
