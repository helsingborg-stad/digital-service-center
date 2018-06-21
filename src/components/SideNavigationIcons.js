import PropTypes from 'prop-types';
import React from 'react';
import * as Icons from './icons/';
import './font-awesome/font-awesome.min.css';

const SideNavigationIcons = ({type, icon, size, isActive}) => {
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
    Icons[`${customIcons[icon]}`]({className: 'customIcon', color: isActive ? '#fff' : '#c70d53'})
    :
    <div style={{fontSize: convertSize}}>
      <i className={type + ' ' + icon}></i>
    </div>;
};

SideNavigationIcons.propTypes = {
  icon: PropTypes.string.isRequired,
  size: PropTypes.string,
  isActive: PropTypes.bool
};

export default SideNavigationIcons;
