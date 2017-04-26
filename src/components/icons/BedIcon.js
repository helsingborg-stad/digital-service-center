import React, { PropTypes } from 'react';

/* eslint-disable max-len */
const BedIcon = ({color, className}) => {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 42 33">
      <path fill={color} d="M53.626,464.92v9.517h6.4v-4.978H89.567v4.978h6.4V464.92H53.626Zm7.383-13.441c0.092-2.39.861-4.937,6.761-5.214,3.113-.146,6.422.547,6.971,3.6h0.114c0.548-3.054,3.858-3.747,6.97-3.6,5.9,0.277,6.669,2.824,6.761,5.214a19.03,19.03,0,0,1,3.554,1.47v-8.543a3.044,3.044,0,0,0-3.044-3.044H60.5a3.044,3.044,0,0,0-3.044,3.044v8.543A19.033,19.033,0,0,1,61.009,451.479Zm13.788,0.25c-9.352,0-20.993,1.244-21.085,10.454H95.883C95.79,452.981,84.231,451.729,74.8,451.729Z" transform="translate(-53.625 -441.375)"/>
    </svg>
  );
};

BedIcon.propTypes = {
  color: PropTypes.string,
  className: PropTypes.string
};

BedIcon.defaultProps = {
  color: '#000',
  className: ''
};

export default BedIcon;
