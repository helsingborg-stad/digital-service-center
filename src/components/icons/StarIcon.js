import React, { PropTypes } from 'react';

/* eslint-disable max-len */
const StarIcon = ({color, className, strokeColor, strokeSize}) => {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 39.656 39.8753">
    <path stroke={strokeColor} strokeWidth={strokeSize} fill={color} d="M93.45,749.86c-1.972-.871-7.191-1.251-11.7-1.416-1.41-4.075-3.665-10.172-5.551-12.035a1.962,1.962,0,0,0-2.768,0c-1.885,1.864-4.141,7.961-5.55,12.035-4.5.165-9.719,0.545-11.694,1.414a2.023,2.023,0,0,0-.947,2.812c1.285,2.366,4.545,5.886,8.636,9.353a74.9,74.9,0,0,0-2.062,11.553,1.986,1.986,0,0,0,2.9,1.923c2.561-1.36,5.849-2.8,10.107-5.474,1.322,0.83,9.822,5.7,11.025,5.7a2,2,0,0,0,1.977-2.151,74.9,74.9,0,0,0-2.062-11.553c4.092-3.468,7.351-6.989,8.635-9.354A2.019,2.019,0,0,0,93.45,749.86Z" transform="translate(-55 -735.844)"/>
    </svg>
  );
};

StarIcon.propTypes = {
  color: PropTypes.string,
  className: PropTypes.string,
  strokeColor: PropTypes.string,
  strokeSize: PropTypes.number
};

StarIcon.defaultProps = {
  color: '#000',
  className: '',
  strokeSize: 0,
  strokeColor: 'transparent'
};

export default StarIcon;
