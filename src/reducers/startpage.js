export function startpageHasErrored(state = false, action) {
  switch (action.type) {
  case 'STARTPAGE_HAS_ERRORED':
    return action.hasErrored;

  default:
    return state;
  }
}

export function startpageIsLoading(state = false, action) {
  switch (action.type) {
  case 'STARTPAGE_IS_LOADING':
    return action.isLoading;

  default:
    return state;
  }
}

export function startpage(state = {}, action) {
  switch (action.type) {
  case 'STARTPAGE_FETCH_DATA_SUCCESS':
    return action.startpage;

  default:
    return state;
  }
}
