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
