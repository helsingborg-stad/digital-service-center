
export function translation(state = {}, action) {
  switch (action.type) {
  case 'TRANSLATE_HAS_ERRORED':
    return Object.assign({}, state, { [action.id]: {
      ...state[action.id],
      error: action.hasErrored }
    });
  case 'TRANSLATE_IS_LOADING':
    return Object.assign({}, state, { [action.id]: {
      ...state[action.id],
      loading: action.isLoading }
    });
  case 'TRANSLATE_FETCH_SUCCESS':
    return Object.assign({}, state, {
      [action.id]: {
        ...state[action.id],
        content: action.translation
      }
    });
  default:
    return state;
  }
}

