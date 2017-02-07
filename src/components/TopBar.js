import React, { Component } from 'react';
import './TopBar.css';
import PaperRipple from 'react-paper-ripple';

export default class TopBar extends Component {
  render() {
    return (
      <div className='TopBar'>
        { this.props.children }
      </div>
    );
  }
}

TopBar.propTypes = {
  children: React.PropTypes.oneOfType([
    React.PropTypes.arrayOf(React.PropTypes.node),
    React.PropTypes.node
  ])
};

export class TopBarLink extends Component {
  render() {
    return (
      <PaperRipple tag='a' className='TopBarLink' href={this.props.href}>
        {this.props.linkName}
      </PaperRipple>
    );
  }
}

TopBarLink.propTypes = {
  href: React.PropTypes.string.isRequired,
  linkName: React.PropTypes.string.isRequired
};
