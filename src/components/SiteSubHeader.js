import React from 'react';
import Link from './Link';
import Logo from './Logo';
import './SiteSubHeader.css';

export const SiteSubHeader = ({children, logoColor}) => {
  return (
    <div className='SiteSubHeader'>
      <Logo className='SiteSubHeader-logo' color={logoColor} />
      <span>
      {children}
      </span>
    </div>
  );
};

SiteSubHeader.propTypes = {
  children: React.PropTypes.oneOfType([
    React.PropTypes.arrayOf(React.PropTypes.node),
    React.PropTypes.node
  ]),
  logoColor: React.PropTypes.string
};

export const SiteSubHeaderLink = ({name, href}) => {
  return <Link className='SiteSubHeaderLink' href={href}>{name}</Link>;
};

SiteSubHeaderLink.propTypes = {
  href: React.PropTypes.string.isRequired,
  name: React.PropTypes.string.isRequired
};
