
export function hbgSeSearchHasErrored(term, bool) {
  return {
    type: 'HBG_SE_SEARCH_HAS_ERRORED',
    term,
    hasErrored: bool
  };
}

export function hbgSeSearchIsLoading(term, bool) {
  return {
    type: 'HBG_SE_SEARCH_IS_LOADING',
    term,
    isLoading: bool
  };
}

export function hbgSeSearchFetchDataSuccess(term, results) {
  return {
    type: 'HBG_SE_SEARCH_FETCH_DATA_SUCCESS',
    term,
    results
  };
}

export function hbgSeSearchFetchData(term) {
  return (dispatch) => {
    dispatch(hbgSeSearchIsLoading(term, true));
    dispatch(hbgSeSearchHasErrored(term, false));
    const url = `/api/hbg-se-search?term=${term}`;

    return fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw Error(response.statusText);
        }

        dispatch(hbgSeSearchIsLoading(term, false));

        return response;
      })
      .then((response) => response.json())
      .then((result) => dispatch(hbgSeSearchFetchDataSuccess(term, result)))
      .catch(() => dispatch(hbgSeSearchHasErrored(true)));
  };
}
