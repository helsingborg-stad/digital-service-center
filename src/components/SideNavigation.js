import React, { PropTypes } from 'react';
import cn from 'classnames';

import * as Icons from './icons/';

import './SideNavigation.css';

const SideNavigation = ({children}) => (
  <ul className='SideNavigation'>{children}</ul>
);

SideNavigation.propTypes = {
  children: React.PropTypes.oneOfType([
    React.PropTypes.arrayOf(React.PropTypes.node),
    React.PropTypes.node
  ])
};

const SideNavigationLink = ({selected, activeColor, handleClick, name, children, icon}) => (
  <li
    className={cn('SideNavigationLink', {'SideNavigationLink--selected': selected})}
    style={{ background: selected ? activeColor : '#fff'}}
    onClick={handleClick
  }>
    { icon &&
    <span className='SideNavigationLink__icon'>
      {Icons[`${icon}Icon`]({color: selected ? '#fff' : activeColor, className: 'foo'})}
    </span>
    }
    {name}
    {selected && children && !!children.length &&
    <ul>
      {children}
    </ul>
    }
  </li>
);

SideNavigationLink.propTypes = {
  selected: PropTypes.bool,
  activeColor: PropTypes.string,
  handleClick: PropTypes.func,
  name: PropTypes.string,
  children: PropTypes.oneOfType([
    React.PropTypes.arrayOf(React.PropTypes.node)
  ])
};

export { SideNavigation, SideNavigationLink };
