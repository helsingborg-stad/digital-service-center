import React, { Component } from 'react';
import cn from 'classnames';

import './SideNavigation.css';

export class SideNavigation extends Component {
  render() {
    return <ul className='SideNavigation'>{this.props.children}</ul>;
  }
}

export class SideNavigationLink extends Component {
  render() {
    return (
      <li
        className={cn('SideNavigationLink', {'SideNavigationLink--selected': this.props.selected})}
        aria-role='button'
        onClick={this.props.handleClick
      }>
        {this.props.name}
        {this.props.selected && this.props.children && !!this.props.children.length &&
        <ul>
          {this.props.children}
        </ul>
        }
      </li>
    );
  }
}
