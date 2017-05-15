export function landingPages(state = {}, action) {
  switch (action.type) {
  case 'LANDING_PAGES_FETCH_DATA_SUCCESS':
    return Object.assign({}, state, { [action.lang]: action.landingPages });

  default:
    return state;
  }
}
