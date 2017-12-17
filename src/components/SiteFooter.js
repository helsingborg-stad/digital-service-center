import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import Link from './Link';
import './SiteFooter.css';

const LeftArrow = ({...props}) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 314.069 314.069">
    <g>
      <g>
        <g>
          <path d="M293.004,78.525C249.648,3.436,153.62-22.295,78.531,21.061C3.436,64.411-22.296,160.443,21.068,235.542 c43.35,75.087,139.375,100.822,214.465,57.467C310.629,249.648,336.365,153.621,293.004,78.525z M219.836,265.802 c-60.075,34.685-136.894,14.114-171.576-45.969C13.57,159.762,34.155,82.936,94.232,48.253 c60.071-34.683,136.894-14.099,171.578,45.979C300.495,154.308,279.908,231.118,219.836,265.802z M187.645,101.528 c-6.136-6.133-16.078-6.133-22.205,0l-44.406,44.4c-6.129,6.131-6.129,16.078,0,22.213l44.406,44.402 c6.127,6.128,16.069,6.128,22.205,0c6.132-6.131,6.123-16.077,0-22.201l-33.308-33.302l33.308-33.315 C193.777,117.587,193.785,107.649,187.645,101.528z" fill="#ffffff"/>
        </g>
      </g>
    </g>
  </svg>
)

const SiteFooter = ({children, color, backToStartPath, translatables}) => {
  return (
    <div className='SiteFooter' style={{background: color}}>
      <Link className='SiteFooter-back-to-start' to={backToStartPath}>
        <LeftArrow style={{width: '25px', transform: 'translateY(-2px)', marginRight: '0.6rem', marginBottom: '-0.7em'}} />
        {translatables.backToStart}
      </Link>
      <span className='SiteFooterLink-wrapper'>
      {children}
      </span>
    </div>
  );
};

SiteFooter.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  color: PropTypes.string,
  translatables: PropTypes.shape({
    backToStart: PropTypes.string.isRequired
  }).isRequired
};

const mapStateToProps = (state) => {
  return {
    translatables: state.siteSettings.translatables[state.activeLanguage]
  };
};

const SiteFooterConnected = connect(mapStateToProps, null)(SiteFooter)

export { SiteFooterConnected as SiteFooter };

export const SiteFooterLink = ({link}) => {
  switch (link.type) {
  case 'iframe':
    return (
    <Link className='SiteFooterLink' iframe={link}>
      {link.name}
    </Link>
    );
  case 'page':
    return (
    <Link className='SiteFooterLink' page={link}>
      {link.name}
    </Link>
    );
  default:
    return null;
  }
};