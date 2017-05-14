
export function searchHasErrored(state = {}, action) {
  switch (action.type) {
  case 'SEARCH_HAS_ERRORED':
    return Object.assign({}, state, { [action.term]: action.hasErrored });

  default:
    return state;
  }
}

export function searchIsLoading(state = false, action) {
  switch (action.type) {
  case 'SEARCH_IS_LOADING':
    return Object.assign({}, state, { [action.term]: action.isLoading });

  default:
    return state;
  }
}

export function search(state = {}, action) {
  switch (action.type) {
  case 'SEARCH_FETCH_DATA_SUCCESS':
    return Object.assign({}, state, { [action.term]: action.results });

  default:
    return state;
  }
}
