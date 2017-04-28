import { landingPagesFetchDataSuccess } from './landingPages';

export function eventsHasErrored(bool) {
  return {
    type: 'EVENTS_HAS_ERRORED',
    hasErrored: bool
  };
}

export function eventsAreLoading(bool) {
  return {
    type: 'EVENTS_ARE_LOADING',
    isLoading: bool
  };
}

export function eventsFetchDataSuccess(events) {
  return {
    type: 'EVENTS_FETCH_DATA_SUCCESS',
    events
  };
}

export function eventsFetchData(url) {
  return (dispatch) => {
    dispatch(eventsAreLoading(true));
    dispatch(eventsHasErrored(false));

    return fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw Error(response.statusText);
        }

        dispatch(eventsAreLoading(false));

        return response;
      })
      .then((response) => response.json())
      .then((data) => {
        dispatch(landingPagesFetchDataSuccess(data.landingPages));
        dispatch(eventsFetchDataSuccess(data.events));
      })
      .catch((e) => {
        // eslint-disable-next-line no-console
        console.warn('eventsFetchData error', e);
        dispatch(eventsHasErrored(true));
      });
  };
}
