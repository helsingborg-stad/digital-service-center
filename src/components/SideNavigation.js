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

const SideNavigationLink = ({id, activeCategories, activeColor, handleClick,
                             name, subCategories, icon, type, menuItem, iframeUrl}) => {
  const hasChildren = subCategories && subCategories.length && activeCategories.includes(id);
  const isActive = activeCategories.includes(id);
  return (
    <li
      className={cn('SideNavigationLink',
        {'SideNavigationLink--selected': isActive,
        'SideNavigationLink--has-children': hasChildren })}
      style={{ background: isActive ? activeColor : '#fff'}}
      onClick={(e) => {
        e.stopPropagation();
        handleClick({id, type, menuItem, iframeUrl});
      }}
    >
      { icon &&
      <span className='SideNavigationLink__icon'>
        {Icons[`${icon}Icon`]({color: isActive ? '#fff' : '#c70d53'})}
      </span>
      }
      {name}
      {isActive && subCategories && !!subCategories.length &&
      <ul>
        {subCategories.map(sub => (
          <li
            key={sub.id}
            className={cn('SideNavigationLink',
              {'SideNavigationLink--selected': activeCategories.includes(sub.id)}
            )}
            style={{ background: activeCategories.includes(sub.id) ? activeColor : '#fff'}}
            onClick={(e) => {
              e.stopPropagation();
              const { id: subId, type: subType, iframeUrl: subIframeUrl } = sub;
              handleClick({id: subId, type: subType, menuItem: sub, iframeUrl: subIframeUrl});
            }}
          >
            {sub.name}
          </li>
        ))}
      </ul>
      }
    </li>
  );
};

SideNavigationLink.propTypes = {
  id: PropTypes.number.isRequired,
  activeCategories: PropTypes.array.isRequired,
  activeColor: PropTypes.string,
  handleClick: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  subCategories: React.PropTypes.arrayOf(React.PropTypes.object),
  icon: PropTypes.string,
  menuItem: PropTypes.any,
  iframeUrl: PropTypes.string
};

export { SideNavigation, SideNavigationLink };
