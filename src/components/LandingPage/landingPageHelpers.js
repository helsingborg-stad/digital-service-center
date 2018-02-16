export const selectedEventsWithCoordinates = (events, activeCategories, eventCategories) => {
  const getActiveColorForEvent = (event) => {
    const firstActiveCat = event.categories.map(c => c.id).find(c => activeCategories.includes(c));
    let foundCategory = eventCategories.find(c => c.id === firstActiveCat);

    // Category not found, search in subcategories
    if (!foundCategory) {
      const foundSubCategories = eventCategories.filter(cat => {
        return cat.subCategories && cat.subCategories.length;
      }).map(cat => cat.subCategories)
        .reduce((acc, cat) => acc.concat(cat), []);

      foundSubCategories.forEach(item => {
        if (item.id === firstActiveCat) {
          foundCategory = item;
          return;
        }
      });
    }

    return foundCategory ? foundCategory.activeColor : null;
  };

  const selectedEvents = !activeCategories.length
    ? []
    : events.filter(e => {
      return e.categories.map(c => c.id).some(c => activeCategories.includes(c));
    }).map(e => {
      return Object.assign({}, e, { activeColor: getActiveColorForEvent(e) });
    });

  return selectedEvents.filter(e => e.location && e.location.latitude && e.location.longitude)
    .reduce((acc, e) => {
      acc.markers.push({
        id: e.id,
        lat: e.location.latitude,
        lng: e.location.longitude,
        eventData: e,
        activeColor: e.activeColor
      });
      return acc;
    }, { markers: [] });
};
