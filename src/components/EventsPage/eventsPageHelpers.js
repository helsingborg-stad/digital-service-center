import Moment from 'moment';
import { getEventsBySelectedDates } from '../EventsDateList';

export const getDistinctEventCategories = (events, excludedCategories) => {
  const distinctCategories = events.reduce((acc, event) => {
    if (event.type !== 'event') {
      return acc;
    }
    event.categories.forEach(cat => {
      if (!acc.some(c => c.id === cat.id) && !excludedCategories.includes(cat.id)) {
        acc.push(cat);
      }
    });
    return acc;
  }, []);
  return distinctCategories.sort((a, b) => a.name.localeCompare(b.name));
};

const eventsWithRelevantCategories = (events, categories) => {
  return categories.length
    ? events.slice(0).filter(e => e.categories.some(c => categories.includes(c.id)))
    : events;
};

export function getClosestEventDate(event) {
  const date = Moment(event.occasions.reduce((closestDate, occ) => {
    if (!closestDate.occasions || closestDate.startDate >= occ.startDate) {
      return occ;
    }
    return closestDate;
  }).startDate);
  return {
    date: date.format('YYYY-MM-DD HH:mm'),
    week: date.week()
  };
}

function compareDates(a, b) {
  if (a.date < b.date) {
    return -1;
  }
  if (a.date > b.date) {
    return 1;
  }
  return 0;
}

export const filterEventsForEventsPage = (events, activeCategories, selectedDates) => {
  const eventsHavingDates = events.filter(e => e.occasions && !!e.occasions.length);
  const eventsForSelectedDates = getEventsBySelectedDates(eventsHavingDates, selectedDates);
  const eventsWithCats = eventsWithRelevantCategories(eventsForSelectedDates, activeCategories);
  const eventsWithWeekNumber = eventsWithCats.map(e => {
    return { id: e.id, date: getClosestEventDate(e)};
  });

  const eventsDict = eventsWithWeekNumber.reduce((acc, event) => {
    if (!acc[event.date.week]) {
      acc[event.date.week] = [];
    }
    acc[event.date.week].push({id: event.id, date: event.date.date});
    return acc;
  }, {});

  Object.keys(eventsDict).forEach(week => {
    eventsDict[week] = eventsDict[week].sort(compareDates);
  });

  return {
    numEvents: eventsHavingDates.length,
    numActiveEvents: eventsWithCats.length,
    eventsByWeekNumber: eventsDict
  };
};
