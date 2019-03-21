import PropTypes from 'prop-types';
import React from 'react';
import './EventsDateList.css';
import Moment from 'moment';

const getOldestStartDate = (occasions) => {
  return occasions.reduce((closestDate, occ) => {
    if (!closestDate || closestDate >= occ.startDate) {
      return occ.startDate;
    }
    return closestDate;
  }, null);
};

const getDistinctEventOrderedByStartDate = ({events}) => {
  return events.sort((event1, event2) => {
    const event1startDate = getOldestStartDate(event1.occasions);
    const event2startDate = getOldestStartDate(event2.occasions);
    return Moment(event1startDate).diff(Moment(event2startDate));
  });
};

export const getEventsBySelectedDates = (events, selectedDates) => {
  let selectedEvents = events.slice(0).filter(
    event => event.type === 'event'
    && event.occasions
    && event.occasions.length
    //&& event.id === 156980
  );

  if (!selectedDates || !selectedDates.endDate) {
    return getDistinctEventOrderedByStartDate({events: selectedEvents});
  }

  return getDistinctEventOrderedByStartDate({events: selectedEvents.map(event => {
    return Object.assign({...event}, { occasions: event.occasions
      .filter(occ => {
        if (!occ || !occ.startDate || !occ.endDate) {
          return false;
        }
        const startDate = selectedDates.startDate.startOf('day');
        const endDate = selectedDates.endDate.endOf('day');

        if (selectedDates.startDate.isBetween(occ.startDate, occ.endDate)) {
          return selectedDates.startDate.isBetween(occ.startDate, occ.endDate);
        }
        return startDate.isSameOrBefore(occ.startDate, 'days')
        && endDate.isSameOrAfter(occ.endDate, 'days');
      })
    });
  }).filter(event => event.occasions.length)});
};

const EventsDateList = ({events, selectedDates, handleOverlayEvent}) => {
  const clonedEvents = getEventsBySelectedDates(JSON.parse(JSON.stringify(events)), selectedDates);
  return (
    <ul className='EventDateList'>
      { clonedEvents && clonedEvents.map(event => (
        <li key={event.id} onClick={() => handleOverlayEvent(event)}>
          <div className='EventDateList-contentWrapper'>
            <img className='EventDateList-img' src={event.imgThumbnailUrl} alt={event.name} />
          </div>
          <div className='EventDateList-contentWrapper'>
            <span className='EventDateList-date'>
              {Moment(event.occasions.reduce((closestDate, occ) => {
                if (!closestDate.occasions || closestDate.startDate >= occ.startDate) {
                  return occ;
                }
                return closestDate;
              }).startDate).format('YYYY-MM-DD')}
            </span>
            <span className='EventDateList-name'>
              {event.name}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
};

EventsDateList.propTypes = {
  events: PropTypes.array,
  selectedDates: PropTypes.object,
  handleOverlayEvent: PropTypes.func
};

export default EventsDateList;
