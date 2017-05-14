
export function crmHasErrored(bool) {
  return {
    type: 'CRM_HAS_ERRORED',
    hasErrored: bool
  };
}

export function crmIsLoading(bool) {
  return {
    type: 'CRM_IS_LOADING',
    isLoading: bool
  };
}

export function crmFetchDataSuccess(crm) {
  return {
    type: 'CRM_FETCH_DATA_SUCCESS',
    crm
  };
}

export function crmFetchData(url) {
  return (dispatch) => {
    dispatch(crmIsLoading(true));
    dispatch(crmHasErrored(false));

    return fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw Error(response.statusText);
        }

        dispatch(crmIsLoading(false));

        return response;
      })
      .then((response) => response.json())
      .then((data) => {
        dispatch(crmFetchDataSuccess(data));
      })
      .catch((e) => {
        // eslint-disable-next-line no-console
        console.warn('crmFetchData error', e);
        dispatch(crmHasErrored(true));
      });
  };
}
