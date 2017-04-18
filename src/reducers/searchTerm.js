export function searchTerm(state = null, action) {
  switch (action.type) {
  case 'SEARCH_TERM':
    return action.searchTerm;

  default:
    return state;
  }
}