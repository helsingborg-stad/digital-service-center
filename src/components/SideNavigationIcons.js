import PropTypes from 'prop-types';
import React from 'react';
import * as Icons from './icons/';
import './font-awesome/font-awesome.min.css';

const SideNavigationIcons = ({icon, size, isActive}) => {
  const customIcons = {
    'fa-bed': 'BedIcon',
    'fa-camera': 'CameraIcon',
    'fa-clock': 'ClockIcon',
    'fa-clock-o': 'ClockIcon',
    'fa-info-circle': 'InfoIcon',
    'fa-info': 'InfoIcon',
    'fa-cutlery': 'CutleryIcon',
    'fa-star': 'StarIcon',
    'fa-glass-martini': 'CocktailIcon',
    'fa-glass': 'CocktailIcon'
  };

  const convertSize = size + 'rem';
  return icon in customIcons ?
    <span className='faIcon'>
      {Icons[`${customIcons[icon]}`]({className: 'customIcon', color: isActive ? '#fff' : '#c70d53'})}
    </span>
    :
    <span className='faIcon'>
      <i className={'fa fas fab ' + icon} style={{fontSize: convertSize}}></i>
    </span>;
};

SideNavigationIcons.propTypes = {
  icon: PropTypes.string.isRequired,
  size: PropTypes.string,
  isActive: PropTypes.bool
};

export default SideNavigationIcons;
