import Moment from 'moment';
import { getEventsBySelectedDates } from '../EventsDateList';
import SearchHandler from '../Search/SearchHandler';

const eventsWithRelevantCategories = (events, activeCategories) => {
  const matchesAllActiveCategories = (e) =>
    activeCategories.every(actCat => e.importedCategories.includes(actCat));

  const eventsForCats = activeCategories.length
    ? events.slice(0).filter(matchesAllActiveCategories)
    : events;

  const categoriesUnsorted = eventsForCats.reduce((cats, event) => {
    event.importedCategories.forEach(cat => {
      cats[cat] = 1 + (cats[cat] || 0);
    });
    return cats;
  }, {});

  const categories = {};
  Object.keys(categoriesUnsorted).sort().forEach(key => {
    categories[key] = categoriesUnsorted[key];
  });

  return {
    eventsForCats,
    categories
  };
};

export function getClosestEventDate(event) {
  const date = Moment(event.occasions.reduce((closestDate, occ) => {
    if (!closestDate.occasions || closestDate.startDate >= occ.startDate) {
      return occ;
    }
    return closestDate;
  }).startDate);
  const endDate = Moment(event.occasions.reduce((closestDate, occ) => {
    if (!closestDate.occasions || closestDate.endDate >= occ.endDate) {
      return occ;
    }
    return closestDate;
  }).endDate);
  const changeWeekIfLongEvent = endDate > Moment() && date < Moment() ? Moment().week() : date.week();
  return {
    date: date.format('YYYY-MM-DD HH:mm'),
    week: changeWeekIfLongEvent
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

const filterBySearchTerm = (events, term) =>{
  if (!term) {
    return events;
  }

  return new SearchHandler({
    events,
    fetchData: () => {},
    landingPagePages: [],
    crm: []
  }).search(term).eventsSearchResults;
};

export const filterEventsForEventsPage = (events, activeCategories, selectedDates, searchTerm) => {
  const eventsHavingDates = events.filter(e => e.occasions && !!e.occasions.length);
  const eventsForSelectedDates = getEventsBySelectedDates(eventsHavingDates, selectedDates);
  const eventsSearch = filterBySearchTerm(eventsForSelectedDates, searchTerm);
  const { eventsForCats, categories }
    = eventsWithRelevantCategories(eventsSearch, activeCategories);
  const eventsWithWeekNumber = eventsForCats.map(e => {
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
    numActiveEvents: eventsForCats.length,
    eventsByWeekNumber: eventsDict,
    categories
  };
};
