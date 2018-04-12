import addressFormatter from '../util/formatOpenStreetMapAddresses';

export function addressSearchHasErrored(term, bool) {
  return {
    type: 'ADDRESS_SEARCH_HAS_ERRORED',
    term,
    hasErrored: bool
  };
}

export function addressSearchIsLoading(term, bool) {
  return {
    type: 'ADDRESS_SEARCH_IS_LOADING',
    term,
    isLoading: bool
  };
}

export function addressSearchFetchDataSuccess(term, results) {
  return {
    type: 'ADDRESS_SEARCH_FETCH_DATA_SUCCESS',
    term,
    results
  };
}

export function addressSearchFetchData(term) {
  return (dispatch) => {
    dispatch(addressSearchIsLoading(term, true));
    dispatch(addressSearchHasErrored(term, false));
    const uriEscapedTerm = encodeURIComponent(term.trim());
    const url = `https://nominatim.openstreetmap.org/search/se/helsingborg/${ uriEscapedTerm }?format=json&addressdetails=1`;

    return fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw Error(response.statusText);
        }

        dispatch(addressSearchIsLoading(term, false));

        return response;
      })
      .then((response) => response.json())
      .then((result) => {
        dispatch(addressSearchFetchDataSuccess(term, addressFormatter(result)));
      })
      .catch(() => dispatch(addressSearchHasErrored(true)));
  };
}
