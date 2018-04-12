
export function hbgSeSearchHasErrored(state = {}, action) {
  switch (action.type) {
  case 'HBG_SE_SEARCH_HAS_ERRORED':
    return Object.assign({}, state, { [action.term]: action.hasErrored });

  default:
    return state;
  }
}

export function hbgSeSearchIsLoading(state = false, action) {
  switch (action.type) {
  case 'HBG_SE_SEARCH_IS_LOADING':
    return Object.assign({}, state, { [action.term]: action.isLoading });

  default:
    return state;
  }
}

export function hbgSeSearch(state = {}, action) {
  switch (action.type) {
  case 'HBG_SE_SEARCH_FETCH_DATA_SUCCESS':
    return Object.assign({}, state, { [action.term]: action.results });

  default:
    return state;
  }
}
