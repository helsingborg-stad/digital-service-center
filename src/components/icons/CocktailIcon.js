import React, { PropTypes } from 'react';

/* eslint-disable max-len */
const CocktailIcon = ({color, className}) => {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 38.063 38.3133">
    <path fill={color} d="M92.673,951.526a1.313,1.313,0,0,0-.927-2.239h-7.89l7.656-10.208a1.968,1.968,0,0,0-3.114-2.407l-9.534,12.615H64.175a1.313,1.313,0,0,0-.927,2.239L67.1,955.25a5.46,5.46,0,0,1-2.927.86,5.511,5.511,0,1,1,3.845-9.447h4.444a9.189,9.189,0,1,0-2.72,11.228l4.928,4.928v5.756a20.7,20.7,0,0,0-6.113,2.868,1.025,1.025,0,0,0,.327,1.845c3.678,1.236,14.449,1.238,18.134,0a1.025,1.025,0,0,0,.327-1.845,20.72,20.72,0,0,0-6.114-2.868v-5.756Z" transform="translate(-55 -935.906)"/>
    </svg>
  );
};

CocktailIcon.propTypes = {
  color: PropTypes.string,
  className: PropTypes.string
};

CocktailIcon.defaultProps = {
  color: '#000',
  className: ''
};

export default CocktailIcon;
