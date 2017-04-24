
export function searchHasErrored(bool) {
  return {
    type: 'SEARCH_HAS_ERRORED',
    hasErrored: bool
  };
}

export function searchIsLoading(bool) {
  return {
    type: 'SEARCH_IS_LOADING',
    isLoading: bool
  };
}

export function searchFetchDataSuccess(searchResults) {
  return {
    type: 'SEARCH_FETCH_DATA_SUCCESS',
    searchResults
  };
}

export function searchFetchData(url) {
  return (dispatch) => {
    dispatch(searchIsLoading(true));
    dispatch(searchHasErrored(false));

    return fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw Error(response.statusText);
        }

        dispatch(searchIsLoading(false));

        return response;
      })
      .then((response) => response.json())
      .then((startpage) => dispatch(searchFetchDataSuccess(startpage)))
      .catch(() => dispatch(searchHasErrored(true)));
  };
}
