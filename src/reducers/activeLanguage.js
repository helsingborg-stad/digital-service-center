export function activeLanguage(state = null, action) {
  switch (action.type) {
  case 'ACTIVE_LANGUAGE':
    return action.lang;

  default:
    return state;
  }
}
