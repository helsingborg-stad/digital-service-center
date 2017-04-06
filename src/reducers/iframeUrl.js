export function iframeUrl(state = null, action) {
  switch (action.type) {
  case 'IFRAME_URL':
    return action.iframe;

  default:
    return state;
  }
}
