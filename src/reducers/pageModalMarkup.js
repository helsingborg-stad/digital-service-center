export function pageModalMarkup(state = null, action) {
  switch (action.type) {
  case 'PAGE_MODAL_MARKUP':
    return action.markup;

  default:
    return state;
  }
}
