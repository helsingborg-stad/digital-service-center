import PropTypes from 'prop-types';
import React from 'react';

/* eslint-disable max-len */
const InfoIcon = ({color, className}) => {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 37.438 37.433">
    <path fill={color} d="M76.39,1039.9a18.72,18.72,0,1,0,18.71,18.72A18.724,18.724,0,0,0,76.39,1039.9Zm-0.011,5.88a3,3,0,0,1,2.852,2.91,2.852,2.852,0,0,1-5.7,0A3,3,0,0,1,76.38,1045.78Zm3.995,22.82a1.251,1.251,0,0,1-1.248,1.25H73.635a1.251,1.251,0,0,1-1.248-1.25v-1.25a1.249,1.249,0,0,1,1.248-1.24v-7.49a1.251,1.251,0,0,1-1.248-1.25v-1.25a1.249,1.249,0,0,1,1.248-1.24h4.256a1.249,1.249,0,0,1,1.248,1.24l-0.012,9.99a1.249,1.249,0,0,1,1.248,1.24v1.25Z" transform="translate(-57.656 -1039.91)"/>
    </svg>
  );
};

InfoIcon.propTypes = {
  color: PropTypes.string,
  className: PropTypes.string
};

InfoIcon.defaultProps = {
  color: '#000',
  className: ''
};

export default InfoIcon;