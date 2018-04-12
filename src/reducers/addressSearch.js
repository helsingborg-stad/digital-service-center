
export function addressSearchHasErrored(state = {}, action) {
  switch (action.type) {
  case 'ADDRESS_SEARCH_HAS_ERRORED':
    return Object.assign({}, state, { [action.term]: action.hasErrored });

  default:
    return state;
  }
}

export function addressSearchIsLoading(state = false, action) {
  switch (action.type) {
  case 'ADDRESS_SEARCH_IS_LOADING':
    return Object.assign({}, state, { [action.term]: action.isLoading });

  default:
    return state;
  }
}

export function addressSearch(state = {}, action) {
  switch (action.type) {
  case 'ADDRESS_SEARCH_FETCH_DATA_SUCCESS':
    return Object.assign({}, state, { [action.term]: action.results });

  default:
    return state;
  }
}
