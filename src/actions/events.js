// import store from '../store';

import { landingPagesFetchDataSuccess } from './landingPages';

export function eventsHasErrored(bool, lang) {
  return {
    type: 'EVENTS_HAS_ERRORED',
    lang,
    hasErrored: bool
  };
}

export function eventsAreLoading(bool, lang) {
  return {
    type: 'EVENTS_ARE_LOADING',
    lang,
    isLoading: bool
  };
}

export function eventsFetchDataSuccess(events, lang) {
  return {
    type: 'EVENTS_FETCH_DATA_SUCCESS',
    lang,
    events
  };
}

export function eventsFetchData(url, lang) {
  return (dispatch, getState) => {
    dispatch(eventsAreLoading(true, lang));
    dispatch(eventsHasErrored(false, lang));

    // Only add `lang` query string if the requested language is not default,
    // to prevent 302 redirect
    const defaultLang = getState().siteSettings.languages.find(l => l.isDefault).shortName;
    const langUrl = lang === defaultLang ? url : `${url}?lang=${lang}`;

    return fetch(langUrl)
      .then((response) => {
        if (!response.ok) {
          throw Error(response.statusText);
        }

        dispatch(eventsAreLoading(false, lang));

        return response;
      })
      .then((response) => response.json())
      .then((data) => {
        dispatch(landingPagesFetchDataSuccess(data.landingPages));
        dispatch(eventsFetchDataSuccess(data.events, lang));
      })
      .catch((e) => {
        // eslint-disable-next-line no-console
        console.warn('eventsFetchData error', e);
        dispatch(eventsHasErrored(true));
      });
  };
}
