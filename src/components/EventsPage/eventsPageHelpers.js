import Moment from 'moment';

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

export const getEventsForCategory = (events, categoryId) => {
  return events.filter(event => (
    event.categories.some(c => c.id === categoryId) && event.type === 'event'
  ));
};

export function getClosestEventDate(event) {
  return Moment(event.occasions.reduce((closestDate, occ) => {
    if (!closestDate.occasions || closestDate.startDate >= occ.startDate) {
      return occ;
    }
    return closestDate;
  }).startDate).week();
}

export const getEventIdsGroupedByWeekNumber = (events) => {
  const eventsHavingDates = events.filter(e => e.occasions && !!e.occasions.length);
  const eventsWithWeekNumber = eventsHavingDates.map(e => {
    return { id: e.id, week: getClosestEventDate(e)};
  });
  return eventsWithWeekNumber.reduce((acc, event) => {
    if (!acc[event.week]) {
      acc[event.week] = [];
    }
    acc[event.week].push(event.id);
    return acc;
  }, {});
};
