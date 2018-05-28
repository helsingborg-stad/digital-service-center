
export function translateHasErrored(bool, id, lang) {
  return {
    type: 'TRANSLATE_HAS_ERRORED',
    hasErrored: bool,
    id: id,
    lang: lang
  };
}

export function translationIsLoading(bool, id, lang) {
  return {
    type: 'TRANSLATE_IS_LOADING',
    isLoading: bool,
    id: id,
    lang: lang
  };
}

export function translateFetchTranslationSuccess(text, id, lang) {
  return {
    type: 'TRANSLATE_FETCH_SUCCESS',
    translation: text,
    id: id,
    lang: lang
  };
}

export function translateData(text, id, source, target) {
  return (dispatch) => {
    dispatch(translationIsLoading(true, id, target));
    dispatch(translateHasErrored(false, id, target));

    const data = {
      q: text,
      source: 'sv',
      target: target
    };
    return fetch('https://translation.googleapis.com/language/translate/v2?key=AIzaSyD6nh_5HAPig0rLfpUT5x-JGu00wn_FvWQ', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then((response) => {
        if (!response.ok) {
          throw Error(response.statusText);
        }

        dispatch(translationIsLoading(false, id, target));
        return response;
      })
      .then((response) => response.json())
      .then((resdata) => {
        dispatch(translateFetchTranslationSuccess(
          resdata.data.translations[0].translatedText,
          id,
          target
        ));
      })
      .catch((e) => {
        // eslint-disable-next-line no-console
        console.warn('translateData error', e);
        dispatch(translationIsLoading(false, id, target));
        dispatch(translateHasErrored(true, id, target));
      });
  };
}
