import React, { PropTypes } from 'react';
import EventOverlayDate from './EventOverlayDate';

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

export default function EventOverlayRelatedInformation({event, translatables}) {
  return (
    <div>
      { event.openingHours && !!event.openingHours.length &&
      <div className='EventOverlay-metaBox'>
        <h3>{translatables.openingHours}</h3>
        { event.openingHours.map(date => <span key={date}>{date}<br /></span>)
        }
      </div>
      }

      { event.occasions && !!event.occasions.length &&
      <div className='EventOverlay-metaBox'>
        <h3>{translatables.dateAndTime}</h3>
        { event.occasions.map(occ => <EventOverlayDate
                                        start={getDateFormatted(occ.startDate)}
                                        end={getDateFormatted(occ.endDate)}
                                        key={Math.random()} />)
        }
      </div>
      }
      {getLocation(event) &&
      <div className='EventOverlay-metaBox'>
        <h3>{translatables.location}</h3>
        { getLocation(event) }
      </div>
      }

      { (event.contactEmail || event.contactPhone) &&
      <div className='EventOverlay-metaBox'>
        <h3>{translatables.contact}</h3>
        { event.contactEmail &&
        <div><a href={`mailto:${event.contactEmail}`}>{event.contactEmail}</a></div>
        }
        { event.contactEmail && event.contactPhone &&
        <div style={{height: '0.5rem'}} />
        }
        { event.contactPhone &&
        <div><a href={`tel:${event.contactPhone}`}>{event.contactPhone}</a></div>
        }
      </div>
      }
    </div>
  );
}

EventOverlayRelatedInformation.propTypes = {
  event: PropTypes.object,
  translatables: PropTypes.object
};
