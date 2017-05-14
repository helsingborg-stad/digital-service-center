export function previousUrl(state = '', action) {
  switch (action.type) {
  case 'PREVIOUS_URL':
    return action.prevUrl;

  default:
    return state;
  }
}
