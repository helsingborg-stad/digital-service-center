import React from 'react';
import Link from './Link';
import './SiteFooter.css';

export const SiteFooter = ({children, color}) => {
  return (
    <div className='SiteFooter' style={{background: color}}>
      <span className='SiteFooterLink-wrapper'>
      {children}
      </span>
    </div>
  );
};

SiteFooter.propTypes = {
  children: React.PropTypes.oneOfType([
    React.PropTypes.arrayOf(React.PropTypes.node),
    React.PropTypes.node
  ]),
  color: React.PropTypes.string
};

export const SiteFooterLink = ({name, href}) => {
  return <Link className='SiteFooterLink' iframe={{url: href}}>{name}</Link>;
};

SiteFooterLink.propTypes = {
  href: React.PropTypes.string.isRequired,
  name: React.PropTypes.string.isRequired
};
