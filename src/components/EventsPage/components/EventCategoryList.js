import React, { Fragment } from 'react';
import FlipMove from 'react-flip-move';
import Scrollbars from 'react-custom-scrollbars';
import SideNavigationIcons from '../../SideNavigationIcons';

import './EventCategoryList.css';

const EventCategoryList = ({categories, categoryIcons, activeCategories, onClick, title}) => (
  <Fragment>
    <div className='EventCategoryListHeader'>{title}</div>

    <div className='EventCategoryList-scrollWrapper'>
      <Scrollbars autoHeight autoHeightMax='300px'>
        <div className='EventCategoryList-innerScrollWrapper'>
          <FlipMove className='EventCategoryList' typeName={'ul'} duration={150}
            enterAnimation='accordionVertical' leaveAnimation='accordionVertical'>
            { categories && Object.keys(categories).map(cat => {
              const isActive = activeCategories.includes(cat);
              const icon = categoryIcons[cat];
              const iconFormat = icon.split(' ');
              return (<li
                id={cat}
                key={cat}
                className={isActive ? 'active' : ''}
                onClick={(ev) => {
                  ev.stopPropagation();
                  onClick(cat);
                }}>
                <SideNavigationIcons type={iconFormat[0]} icon={iconFormat[1]} isActive={isActive} size='1.7'/>
                <span dangerouslySetInnerHTML={{__html: cat}} />
                <span className='EventCategoryList__count'>{`(${categories[cat]})`}</span>
              </li>);
            }
            )}
          </FlipMove>
        </div>
      </Scrollbars>
    </div>
  </Fragment>
);

export default EventCategoryList;
