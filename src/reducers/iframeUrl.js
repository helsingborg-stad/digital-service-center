export function iframeUrl(state = null, action) {
  switch (action.type) {
  case 'IFRAME_URL':
    return action.url;

  default:
    return state;
  }
}
