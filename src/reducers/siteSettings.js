export function siteSettings(state = null, action) {
  switch (action.type) {
  case 'SITE_SETTINGS':
    return action.siteSettings;

  default:
    return state;
  }
}
