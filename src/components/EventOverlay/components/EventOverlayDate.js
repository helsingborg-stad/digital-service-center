import PropTypes from 'prop-types';
import React from 'react';

export default function EventOverlayDate({start, end}) {
  return (
  <div>
    <span className='EventOverlay-dateGraphic'>
      {start.day}
      <br />
      <span className='EventOverlay-dateGraphic__month'>
        {start.month}
      </span>
    </span>
    <span className='EventOverlay-date'>
      {start.time}
    </span>
    { end.day > (start.day)
    ? <span className='EventOverlay-dateSeparator'>–</span>
    : <span className='EventOverlay-dateSeparator EventOverlay-dateSeparator--narrow'>-</span>
    }
    { end.day > (start.day) &&
    <span className='EventOverlay-dateGraphic'>
      {end.day}
      <br />
      <span className='EventOverlay-dateGraphic__month'>
        {end.month}
      </span>
    </span>
    }
    <span className='EventOverlay-date'>
      {end.time}
    </span>
  </div>
  );
}

EventOverlayDate.propTypes = {
  start: PropTypes.object,
  end: PropTypes.object
}