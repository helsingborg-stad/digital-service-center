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
  ({id, activeCategories, activeColor, handleClick, name, subCategories, icon}) => (

  <li
    className={cn('SideNavigationLink',
      {'SideNavigationLink--selected': activeCategories.includes(id),
        'SideNavigationLink--has-children': subCategories
        && subCategories.length && activeCategories.includes(id)
      })}
    style={{ background: activeCategories.includes(id) ? activeColor : '#fff'}}
    onClick={() => handleClick({id: id, subCategories: subCategories, parentId: null})}
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
          style={{ background: activeCategories.includes(sub.id) ? sub.activeColor: '#fff'}}
          onClick={
            (e) => {
              e.stopPropagation();
              handleClick({id: sub.id, subCategories: subCategories, parentId: id});
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
  subCategories: PropTypes.oneOfType([
    React.PropTypes.arrayOf(React.PropTypes.object)
  ]),
  icon: PropTypes.string
};

export { SideNavigation, SideNavigationLink };
