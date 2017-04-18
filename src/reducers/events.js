export function eventsHasErrored(state = false, action) {
  switch (action.type) {
  case 'EVENTS_HAS_ERRORED':
    return action.hasErrored;
  default:
    return state;
  }
}

export function eventsAreLoading(state = false, action) {
  switch (action.type) {
  case 'EVENTS_ARE_LOADING':
    return action.isLoading;
  default:
    return state;
  }
}

export function events(state = {}, action) {
  switch (action.type) {
  case 'EVENTS_FETCH_DATA_SUCCESS':
    return action.events;

  default:
    return state;
  }
}

export function eventsCategories(state = [], action) {
  switch (action.type) {
  case 'EVENTS_CATEGORIES_FETCH_DATA_SUCCESS':
    return action.categories;

  default:
    return state;
  }
}
