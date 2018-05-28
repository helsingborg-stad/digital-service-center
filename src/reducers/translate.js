
export function translation(state = {}, action) {
  switch (action.type) {
  case 'TRANSLATE_HAS_ERRORED':
    return Object.assign({}, state, {
      [action.lang]: {
        ...state[action.lang],
        [action.id]: {
          hasErrored: action.hasErrored
        }
      }
    });
  case 'TRANSLATE_IS_LOADING':
    return Object.assign({}, state, {
      loading: action.isLoading
    });
  case 'TRANSLATE_FETCH_SUCCESS':
    return Object.assign({}, state, {
      [action.lang]: {
        ...state[action.lang],
        [action.id]: {
          content: action.translation
        }
      }
    });
  default:
    return state;
  }
}

