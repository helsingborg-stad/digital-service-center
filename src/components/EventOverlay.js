import React, { PropTypes } from 'react';
import Scrollbars from 'react-custom-scrollbars';
import closeCrossSvg from '../media/close-cross.svg';
import './EventOverlay.css';

const EventOverlayBackdrop = ({children}) => (
  <div className='EventOverlayBackdrop'>{children}</div>
);

EventOverlayBackdrop.propTypes = {
  children: PropTypes.element.isRequired
};

const getLocation = (event) => {
  return event.location && event.location.streetAddress && event.location.postalCode
  ? `${event.location.streetAddress}, ${event.location.postalCode}` : null;
};

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const getDateFormatted = (dateStr) => {
  const date = new Date(dateStr);
  return {
    month: monthNames[date.getMonth()],
    day: date.getDate(),
    time: `${date.getHours()}:${date.getMinutes() === 0 ? '00' : date.getMinutes()}`
  };
};

const EventOverlay = ({event, handleClose}) => {
  return (
  <EventOverlayBackdrop>
    <div className='EventOverlay'>
      <div className='EventOverlay-main'>
        <div className='EventOverlay-imgWrapper'>
          <img className='EventOverlay-img' src={event.imgUrl} />
        </div>
        <Scrollbars style={{ marginTop: '1rem', width: 'calc(100% + 1rem)', height: 'calc( 80vh - 4.6875rem - 10.25rem - 2vh - (((76vw - 325px)*0.65)*0.5625)' }}>
        <span className='EventOverlay-content-scrollWrapper'>
        <h2 className='EventOverlay-heading'>{ event.name }</h2>
          <span
            className='EventOverlay-content'
            dangerouslySetInnerHTML={{ __html: event.content.replace(/\r\n/g, '<br />') }}
          />
        </span>
        </Scrollbars>
        <div className='EventOverlay-buttonWrapper'>
          <a href='#asdf' className='EventOverlay-button'>
            Take me there
          </a>
          <a href='#asdf' className='EventOverlay-button'>
            Tickets
          </a>
        </div>
      </div>
      <div className='EventOverlay-aside'>
        <div className='EventOverlay-closeButton-wrapper'>
          <button className='EventOverlay-closeButton' onClick={handleClose}>
            <img src={closeCrossSvg} />
          </button>
        </div>
        { event.occasions && event.occasions.length &&
        <div className='EventOverlay-asideBox'>
          {/* TODO: fix format when occasions span multiple consecutive days, and clean up the code, since right now it's a mess */}
          <h3>Date and time</h3>
          {event.occasions.map(occ => {
            return (
              <div>
                <span className='EventOverlay-dateGraphic'>
                  {getDateFormatted(occ.startDate).day}
                  <br />
                  <span className='EventOverlay-dateGraphic__month'>
                    {getDateFormatted(occ.startDate).month}
                  </span>
                </span>
                <span className='EventOverlay-date'>
                  {getDateFormatted(occ.startDate).time} - {getDateFormatted(occ.endDate).time}
                </span>
              </div>
            );
          })}
        </div>
        }
        { getLocation(event) &&
        <div className='EventOverlay-asideBox'>
          <h3>Location</h3>
          { getLocation(event) }
        </div>
        }
        <div className='EventOverlay-asideBox'>
          <h3>Contact</h3>
          <a href='#'>info@helsingborg.se</a>
        </div>
        <div className='EventOverlay-asideBox'>
          <h3>More information</h3>
          <ul>
            <li><a href='#asdf'>When flowers rhodedendron</a></li>
            <li><a href='#asdf'>When flowers rhodedendron</a></li>
            <li><a href='#asdf'>When flowers rhodedendron</a></li>
            <li><a href='#asdf'>When flowers rhodedendron</a></li>
            <li><a href='#asdf'>When flowers rhodedendron</a></li>
          </ul>
        </div>
      </div>
    </div>
  </EventOverlayBackdrop>
  );
}

EventOverlay.propTypes = {
  handleClose: PropTypes.func,
  event: PropTypes.object // todo
};

export default EventOverlay;
