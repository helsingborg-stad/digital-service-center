import React, { Component } from 'react';
import Link from './Link';
import './SiteSubHeader.css';

export class SiteSubHeader extends Component {
  render() {
    return (
      <div className='SiteSubHeader'>
        <img src='' className='SiteSubHeader-logo' alt='' /> { /* TODO: add logo src */ }
        {this.props.children}
      </div>
    );
  }
}

SiteSubHeader.propTypes = {
  children: React.PropTypes.oneOfType([
    React.PropTypes.arrayOf(React.PropTypes.node),
    React.PropTypes.node
  ])
};

export class SiteSubHeaderLink extends Component {
  render() {
    return (
      <Link className='SiteSubHeaderLink' href={this.props.href}>
        {this.props.name}
      </Link>
    );
  }
}

SiteSubHeaderLink.propTypes = {
  href: React.PropTypes.string.isRequired,
  name: React.PropTypes.string.isRequired
};
