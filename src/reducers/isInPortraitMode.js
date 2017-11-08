
export function isInPortraitMode(state = false, action) {
  switch (action.type) {
  case 'IS_IN_PORTRAIT_MODE':
    return action.matches;

  default:
    return state;
  }
}
