import PropTypes from 'prop-types';
import React from 'react';

/* eslint-disable max-len */
const EnFlag = ({className}) => {
  return (
  <svg className={className} viewBox="0 0 223.6 130.4">
    <defs>
      <clipPath id="clip-path" transform="translate(-1136.4 -1334.5)">
        <rect style={{fill: 'none'}} x="1136.4" y="1334.5" width="223.6" height="130.44"/>
      </clipPath>
    </defs>
    <g>
      <g>
        <g>
          <g style={{clipPath: 'url(#clip-path)'}}>
            <rect style={{fill: '#fff'}} width="223.6" height="130.44"/>
            <polygon style={{fill: '#bd0034'}} points="149.7 47.2 223.6 5.8 223.6 0 218.5 0 134.3 47.2 149.7 47.2"/>
            <polygon style={{fill: '#bd0034'}} points="146.2 85.9 223.6 129.2 223.6 120.5 161.7 85.9 146.2 85.9"/>
            <polygon style={{fill: '#bd0034'}} points="0 9.9 66.2 47.2 81.7 47.2 0 1.3 0 9.9"/>
            <polygon style={{fill: '#bd0034'}} points="78.2 85.9 0 129.7 0 130.4 14.1 130.4 93.6 85.9 78.2 85.9"/>
            <polygon style={{fill: '#1a237b'}} points="208.3 0 130 0 130 43.8 208.3 0"/>
            <polygon style={{fill: '#1a237b'}} points="95.5 0 17.5 0 95.5 43.8 95.5 0"/>
            <polygon style={{fill: '#1a237b'}} points="223.6 47.2 223.6 17.2 170.5 47.2 223.6 47.2"/>
            <polygon style={{fill: '#1a237b'}} points="223.6 115.5 223.6 85.9 170.5 85.9 223.6 115.5"/>
            <polygon style={{fill: '#1a237b'}} points="21.9 130.4 95.5 130.4 95.5 89.2 21.9 130.4"/>
            <polygon style={{fill: '#1a237b'}} points="130 130.4 203.8 130.4 130 89.2 130 130.4"/>
            <polygon style={{fill: '#1a237b'}} points="0 85.9 0 116.8 55 85.9 0 85.9"/>
            <polygon style={{fill: '#1a237b'}} points="0 47.2 55 47.2 0 16.2 0 47.2"/>
            <polygon style={{fill: '#bd0034'}} points="102.4 0 102.4 54.9 0 54.9 0 78.2 102.4 78.2 102.4 130.4 123.1 130.4 123.1 78.2 223.6 78.2 223.6 54.9 123.1 54.9 123.1 0 102.4 0"/>
          </g>
        </g>
      </g>
    </g>
  </svg>
  );
};

EnFlag.propTypes = {
  className: PropTypes.string
};

EnFlag.defaultProps = {
  className: ''
};

export default EnFlag;