import React, { Fragment } from 'react';
import FlipMove from 'react-flip-move';
import Scrollbars from 'react-custom-scrollbars';

import './EventCategoryList.css';

const EventCategoryList = ({categories, activeCategories, onClick, title}) => (
  <Fragment>
    <div className='EventCategoryListHeader'>{title}</div>

    <div className='EventCategoryList-scrollWrapper'>
      <Scrollbars autoHeight autoHeightMax='300px'>
        <div className='EventCategoryList-innerScrollWrapper'>
          <FlipMove className='EventCategoryList' typeName={'ul'} duration={150}
            enterAnimation='accordionVertical' leaveAnimation='accordionVertical'>
            { categories && Object.keys(categories).map(cat =>
              <li
                id={cat}
                key={cat}
                className={activeCategories.includes(cat) ? 'active' : ''}
                onClick={(ev) => {
                  ev.stopPropagation();
                  onClick(cat);
                }}>
                <span dangerouslySetInnerHTML={{__html: cat}} />
                <span className='EventCategoryList__count'>{`(${categories[cat]})`}</span>
              </li>
            )}
          </FlipMove>
        </div>
      </Scrollbars>
    </div>
  </Fragment>
);

export default EventCategoryList;
