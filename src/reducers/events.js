export function eventsHasErrored(state = {}, action) {
  switch (action.type) {
  case 'EVENTS_HAS_ERRORED':
    return Object.assign({}, state, { [action.lang]: action.hasErrored });

  default:
    return state;
  }
}

export function eventsAreLoading(state = {}, action) {
  switch (action.type) {
  case 'EVENTS_ARE_LOADING':
    return Object.assign({}, state, { [action.lang]: action.isLoading });

  default:
    return state;
  }
}

export function events(state = {}, action) {
  switch (action.type) {
  case 'EVENTS_FETCH_DATA_SUCCESS':
    return Object.assign({}, state, { [action.lang]: action.events });

  default:
    return state;
  }
}
