import Moment from 'moment';
import { getEventsBySelectedDates } from '../EventsDateList';
import SearchHandler from '../Search/SearchHandler';

const eventsWithRelevantCategories = (events, activeCategories) => {
  const matchesAllActiveCategories = (e) =>
    activeCategories.every(actCat => Object.keys(e.importedCategories).includes(actCat));

  const eventsForCats = activeCategories.length
    ? events.slice(0).filter(matchesAllActiveCategories)
    : events;

  const categoriesAndIcons = eventsForCats.reduce((x, event) => {
    Object.entries(event.importedCategories).forEach(([cat, icon]) => {
      x.categories[cat] = 1 + (x.categories[cat] || 0);
      x.icons[cat] = icon;
    });
    return x;
  }, { categories: {}, icons: {}});

  const categoryIcons = categoriesAndIcons.icons;

  const categories = {};
  Object.keys(categoriesAndIcons.categories).sort().forEach(key => {
    categories[key] = categoriesAndIcons.categories[key];
  });

  return {
    eventsForCats,
    categories,
    categoryIcons
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
  const { eventsForCats, categories, categoryIcons }
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
    categories,
    categoryIcons
  };
};
