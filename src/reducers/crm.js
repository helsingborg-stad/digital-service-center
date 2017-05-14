export function crmHasErrored(state = false, action) {
  switch (action.type) {
  case 'CRM_HAS_ERRORED':
    return action.hasErrored;

  default:
    return state;
  }
}

export function eventsAreLoading(state = false, action) {
  switch (action.type) {
  case 'CRM_IS_LOADING':
    return action.isLoading;

  default:
    return state;
  }
}

export function crm(state = {}, action) {
  switch (action.type) {
  case 'CRM_FETCH_DATA_SUCCESS':
    return action.crm;

  default:
    return state;
  }
}
