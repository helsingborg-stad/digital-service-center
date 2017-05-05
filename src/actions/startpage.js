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
  return (dispatch, getState) => {
    dispatch(startpageIsLoading(true, lang));
    dispatch(startpageHasErrored(false, lang));

    // Only add `lang` query string if the requested language is not default,
    // to prevent 302 redirect
    const defaultLang = getState().siteSettings.languages.find(l => l.isDefault).shortName;
    const langUrl = lang === defaultLang ? url : `${url}?lang=${lang}`;

    return fetch(langUrl)
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
