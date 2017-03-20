export function landingPages(state = {}, action) {
  switch (action.type) {
  case 'LANDING_PAGES_FETCH_DATA_SUCCESS':
    return action.landingPages;

  default:
    return state;
  }
}
