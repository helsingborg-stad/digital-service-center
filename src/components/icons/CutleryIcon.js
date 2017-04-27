import React, { PropTypes } from 'react';

/* eslint-disable max-len */
const CutleryIcon = ({color, className}) => {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25.406 33.1563">
    <path fill={color} d="M75.933,552.68l-1.09-8.966a1.111,1.111,0,0,0-1.1-.968,1.091,1.091,0,0,0-1.089,1.1v7.73H70.442v-7.73a1.113,1.113,0,0,0-1.115-1.1,1.1,1.1,0,0,0-1.094,1.1v7.73H66.024v-7.73a1.1,1.1,0,0,0-2.192-.137l-1.078,9.015c-0.155,1.335.294,3.973,3.863,5.209a117.522,117.522,0,0,0-1.255,13.326,4.006,4.006,0,0,0,7.95,0,117.473,117.473,0,0,0-1.255-13.326C75.418,556.77,76.123,554.259,75.933,552.68Zm-6.6,22.086h0Zm15.926-33.128c-1.495,0-2.993,1.1-3.773,3.312A54.425,54.425,0,0,0,79.278,558.2a4.015,4.015,0,0,0,2.612,4.072,56.242,56.242,0,0,0-1.222,9.179c0,2.209,1.543,3.313,3.752,3.313s3.692-1.1,3.692-3.313v-26.5A3.052,3.052,0,0,0,85.263,541.638Z" transform="translate(-62.719 -541.625)"/>
    </svg>
  );
};

CutleryIcon.propTypes = {
  color: PropTypes.string,
  className: PropTypes.string
};

CutleryIcon.defaultProps = {
  color: '#000',
  className: ''
};

export default CutleryIcon;
