export function startpageHasErrored(bool, lang) {
  return {
    type: 'STARTPAGE_HAS_ERRORED',
    lang,
    hasErrored: bool
  };
}

export function startpageIsLoading(bool, lang) {
  return {
    type: 'STARTPAGE_IS_LOADING',
    lang,
    isLoading: bool
  };
}

export function startpageFetchDataSuccess(startpage, lang) {
  return {
    type: 'STARTPAGE_FETCH_DATA_SUCCESS',
    lang,
    startpage
  };
}

export function startpageFetchData(url, lang) {
  return (dispatch) => {
    dispatch(startpageIsLoading(true, lang));
    dispatch(startpageHasErrored(false, lang));

    return fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw Error(response.statusText);
        }

        dispatch(startpageIsLoading(false, lang));

        return response;
      })
      .then((response) => response.json())
      .then((startpage) => dispatch(startpageFetchDataSuccess(startpage, lang)))
      .catch((e) => {
        // eslint-disable-next-line no-console
        console.warn('startpageFetchData error', e);
        dispatch(startpageHasErrored(true, lang));
      });
  };
}
