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
  ({id, activeCategories, activeColor, handleClick, name, subCategories, icon, handleIframeClick, type, iframeUrl}) => (

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
        if (type && type === 'googleQueryPlace') {
          handleIframeClick(iframeUrl);
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
            {'SideNavigationLink--selected': activeCategories.includes(sub.id || sub.menuId)}
          )}
          style={{ background: activeCategories.includes(sub.id || sub.menuId) ? activeColor : '#fff'}}
          onClick={
            (e) => {
              e.stopPropagation();
              if (sub.type && sub.type === 'googleQueryPlace') {
                handleIframeClick(sub.iframeUrl);
              } else {
                handleClick({id: sub.id || sub.menuId});
              }
            }
          }
          key={sub.id || sub.menuId}
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
  type: PropTypes.string,
  iframeUrl: PropTypes.string,
  subCategories: PropTypes.oneOfType([
    React.PropTypes.arrayOf(React.PropTypes.object)
  ]),
  icon: PropTypes.string
};

export { SideNavigation, SideNavigationLink };
