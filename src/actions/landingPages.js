
export function landingPagesFetchDataSuccess(landingPages, lang) {
  return {
    type: 'LANDING_PAGES_FETCH_DATA_SUCCESS',
    lang,
    landingPages
  };
}
