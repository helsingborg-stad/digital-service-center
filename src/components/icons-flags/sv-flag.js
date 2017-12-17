import PropTypes from 'prop-types';
import React from 'react';

/* eslint-disable max-len */
const SvFlag = ({className}) => {
  return (
  <svg className={className} viewBox="0 0 223.6 130.4">
    <defs>
      <clipPath id="clip-path" transform="translate(-3250.5 -1334.5)">
        <rect style={{fill: 'none'}} x="3250.5" y="1334.5" width="223.6" height="130.44"/>
      </clipPath>
    </defs>
    <g>
      <g>
        <g>
          <g style={{clipPath: 'url(#clip-path)'}}>
            <rect style={{fill: '#2d5a95'}} width="223.6" height="130.44"/>
            <rect style={{fill: '#f3d02f'}} x="65.2" width="26.1" height="130.44"/>
            <rect style={{fill: '#f3d02f'}} y="52.2" width="223.6" height="26.09"/>
          </g>
        </g>
      </g>
    </g>
  </svg>
  );
};

SvFlag.propTypes = {
  className: PropTypes.string
};

SvFlag.defaultProps = {
  className: ''
};

export default SvFlag;