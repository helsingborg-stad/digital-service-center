import PropTypes from 'prop-types';
import React from 'react';
import cn from 'classnames';
import SideNavigationIcons from './SideNavigationIcons';

import './SideNavigation.css';

const SideNavigation = ({children, ...props}) => (
  <ul className='SideNavigation' {...props}>{children}</ul>
);

SideNavigation.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
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
      {icon &&
      <span className='SideNavigationLink__icon'>
        <SideNavigationIcons type={icon.type} icon={icon.icon} size={icon.font_size} isActive={isActive}/>
      </span>}
      {name}
      {isActive && subCategories && !!subCategories.length &&
      <ul>
        { subCategories.map(sub => {
          const isActiveSub = activeCategories.includes(sub.id);
          return (<li
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
            { sub.iconName &&
            <span className='SideNavigationLink__icon'>
              <SideNavigationIcons type={sub.iconName.type} icon={sub.iconName.icon} size={sub.iconName.font_size} isActive={isActiveSub}/>
            </span>
            }
            {sub.name}
          </li>);
        })}
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
  subCategories: PropTypes.arrayOf(PropTypes.object),
  icon: PropTypes.any,
  menuItem: PropTypes.any,
  iframeUrl: PropTypes.string
};

export { SideNavigation, SideNavigationLink };
