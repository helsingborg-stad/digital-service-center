export function startpageHasErrored(state = {}, action) {
  switch (action.type) {
  case 'STARTPAGE_HAS_ERRORED':
    return { [action.lang]: action.hasErrored };

  default:
    return state;
  }
}

export function startpageIsLoading(state = {}, action) {
  switch (action.type) {
  case 'STARTPAGE_IS_LOADING':
    return { [action.lang]: action.isLoading };

  default:
    return state;
  }
}

export function startpage(state = {}, action) {
  switch (action.type) {
  case 'STARTPAGE_FETCH_DATA_SUCCESS':
    return { [action.lang]: action.startpage };

  default:
    return state;
  }
}
