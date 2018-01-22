import PropTypes from 'prop-types';
import React from 'react';
import cn from 'classnames';
import FontAwesome from 'react-fontawesome';
import './font-awesome/font-awesome.min.css';

import * as Icons from './icons/';

import './SideNavigation.css';

const SideNavigation = ({children}) => (
  <ul className='SideNavigation'>{children}</ul>
);

SideNavigation.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ])
};

const SideNavigationLink = ({id, activeCategories, activeColor, handleClick,
  name, subCategories, icon, type, menuItem, iframeUrl, customClasses}) => {
  const hasChildren = subCategories && subCategories.length && activeCategories.includes(id);
  const isActive = activeCategories.includes(id);
  const haveCustomClasses = customClasses.length > 0 ? customClasses[0] : false;
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
      { haveCustomClasses &&
        <FontAwesome
          name={haveCustomClasses}
        />
      }
      { icon && !haveCustomClasses &&
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
            { sub.customClasses.length > 0 &&
              <FontAwesome
                name={sub.customClasses[0]}
              />
            }
            { sub.iconName !== '' && sub.customClasses.length <= 0 &&
            <span className='SideNavigationLink__icon'>
              {Icons[`${sub.iconName}Icon`]({color: sub.isActive ? '#fff' : '#c70d53'})}
            </span>
            }
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
  subCategories: PropTypes.arrayOf(PropTypes.object),
  icon: PropTypes.string,
  menuItem: PropTypes.any,
  iframeUrl: PropTypes.string,
  customClasses: PropTypes.array
};

export { SideNavigation, SideNavigationLink };
