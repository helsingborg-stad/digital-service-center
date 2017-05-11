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
  return events.sort(function (event1, event2) {
    const event1startDate = getOldestStartDate(event1.occasions);
    const event2startDate = getOldestStartDate(event2.occasions);
    return Moment(event1startDate).diff(Moment(event2startDate));
  });
};

const getEventsBySelectedDates = (events, selectedDates) => {
  let selectedEvents = events.slice(0).filter(
    event => event.type === 'event'
    && event.occasions
    && event.occasions.length
  );

  if (!selectedDates) {
    return getDistinctEventOrderedByStartDate({events: selectedEvents});
  }

  const MOMENT_BETWEEN_INCLUSIVE_SYMBOL = '[]';
  return getDistinctEventOrderedByStartDate({events: selectedEvents.map(event => {
    return Object.assign(event, { occasions: event.occasions
      .filter(occ => {
        return (
          (occ.startDate && Moment(selectedDates.startDate).isBetween(
            occ.startDate,
            occ.endDate,
            'days',
            MOMENT_BETWEEN_INCLUSIVE_SYMBOL))
          || (occ.endDate && Moment(selectedDates.endDate).isBetween(
            occ.startDate,
            occ.endDate,
            'days',
            MOMENT_BETWEEN_INCLUSIVE_SYMBOL))
        );
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
            <img className='EventDateList-img' src={event.imgUrl} alt={event.name} />
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
  events: React.PropTypes.array,
  selectedDates: React.PropTypes.object,
  handleOverlayEvent: React.PropTypes.func
};

export default EventsDateList;
