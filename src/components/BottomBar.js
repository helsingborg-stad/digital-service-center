import React, { Component } from 'react';
import './BottomBar.css';
import Link from './Link';

export default class BottomBar extends Component {
  render() {
    return (
      <div className='BottomBar'>
        { this.props.children }
      </div>
    );
  }
}

BottomBar.propTypes = {
  children: React.PropTypes.oneOfType([
    React.PropTypes.arrayOf(React.PropTypes.node),
    React.PropTypes.node
  ])
};

export class BottomBarLink extends Component {
  render() {
    return (
      <Link className='BottomBarLink' iframe={this.props.link}>
        {this.props.link.name}
      </Link>
    );
  }
}

BottomBarLink.propTypes = {
  link: React.PropTypes.object.isRequired
};
