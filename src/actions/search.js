
export function searchHasErrored(term, bool) {
  return {
    type: 'SEARCH_HAS_ERRORED',
    hasErrored: { term, bool }
  };
}

export function searchIsLoading(term, bool) {
  return {
    type: 'SEARCH_IS_LOADING',
    isLoading: { term, bool }
  };
}

export function searchFetchDataSuccess(term, searchResults) {
  return {
    type: 'SEARCH_FETCH_DATA_SUCCESS',
    result: { term, searchResults }
  };
}

export function searchFetchData(url, term) {
  return (dispatch) => {
    dispatch(searchIsLoading(term, true));
    dispatch(searchHasErrored(term, false));
    const searchUrlWithTerm = `${url}?term=${term}`;

    return fetch(searchUrlWithTerm)
      .then((response) => {
        if (!response.ok) {
          throw Error(response.statusText);
        }

        dispatch(searchIsLoading(term, false));

        return response;
      })
      .then((response) => response.json())
      .then((result) => dispatch(searchFetchDataSuccess(term, result)))
      .catch(() => dispatch(searchHasErrored(true)));
  };
}
