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

const SideNavigationLink =
  ({id, activeCategories, activeColor, handleClick, name, subCategories, icon, handleIframeClick, type, iframeUrl, menuItem, changeOverlayEvent}) => (

  <li
    className={cn('SideNavigationLink',
      {'SideNavigationLink--selected': activeCategories.includes(id),
        'SideNavigationLink--has-children': subCategories
        && subCategories.length && activeCategories.includes(id)
      })}
    style={{ background: activeCategories.includes(id) ? activeColor : '#fff'}}
    onClick={
      (e) => {
        e.stopPropagation();
        if (type && (type === 'googleQueryPlace' || type === 'iframe')) {
          handleIframeClick(type === 'iframe' && menuItem ? menuItem : {url: iframeUrl});
        } else if (type && type === 'event') {
          changeOverlayEvent(menuItem);
        } else {
          handleClick({id: id});
        }
      }
    }
  >
    { icon &&
    <span className='SideNavigationLink__icon'>
      {Icons[`${icon}Icon`]({color: activeCategories.includes(id)
        ? '#fff' : '#c70d53'})}
    </span>
    }
    {name}
    {activeCategories.includes(id) && subCategories && !!subCategories.length &&
    <ul>
      {subCategories.map(sub => (
        <li
          className={cn('SideNavigationLink',
            {'SideNavigationLink--selected': activeCategories.includes(sub.id)}
          )}
          style={{ background: activeCategories.includes(sub.id) ? activeColor : '#fff'}}
          onClick={
            (e) => {
              e.stopPropagation();
              if (sub.type && (sub.type === 'googleQueryPlace' || sub.type === 'iframe')) {
                handleIframeClick(sub.type === 'iframe' ? sub : {url: sub.iframeUrl});
              } else if (type && type === 'event') {
                changeOverlayEvent(sub);
              } else {
                handleClick({id: sub.id});
              }
            }
          }
          key={sub.id}
        >
          {sub.name}
        </li>
      ))}
    </ul>
    }
  </li>
);

SideNavigationLink.propTypes = {
  id: PropTypes.number.isRequired,
  activeCategories: PropTypes.array,
  activeColor: PropTypes.string,
  handleClick: PropTypes.func,
  name: PropTypes.string,
  handleIframeClick: PropTypes.func,
  changeOverlayEvent: PropTypes.func,
  type: PropTypes.string,
  iframeUrl: PropTypes.string,
  subCategories: PropTypes.oneOfType([
    React.PropTypes.arrayOf(React.PropTypes.object)
  ]),
  icon: PropTypes.string,
  menuItem: PropTypes.any
};

export { SideNavigation, SideNavigationLink };
