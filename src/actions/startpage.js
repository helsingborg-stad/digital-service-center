export function startpageHasErrored(bool) {
  return {
    type: 'STARTPAGE_HAS_ERRORED',
    hasErrored: bool
  };
}

export function startpageIsLoading(bool) {
  return {
    type: 'STARTPAGE_IS_LOADING',
    isLoading: bool
  };
}

export function startpageFetchDataSuccess(startpage) {
  return {
    type: 'STARTPAGE_FETCH_DATA_SUCCESS',
    startpage
  };
}

export function startpageFetchData(url) {
  return (dispatch) => {
    dispatch(startpageIsLoading(true));
    dispatch(startpageHasErrored(false));

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw Error(response.statusText);
        }

        dispatch(startpageIsLoading(false));

        return response;
      })
      .then((response) => response.json())
      .then((startpage) => dispatch(startpageFetchDataSuccess(startpage)))
      .catch(() => dispatch(startpageHasErrored(true)));
  };
}
