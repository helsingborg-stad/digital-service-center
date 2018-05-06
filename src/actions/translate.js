
export function translateHasErrored(bool, id) {
  return {
    type: 'TRANSLATE_HAS_ERRORED',
    hasErrored: bool,
    id
  };
}

export function translationIsLoading(bool, id) {
  return {
    type: 'TRANSLATE_IS_LOADING',
    isLoading: bool,
    id
  };
}

export function translateFetchTranslationSuccess(text, id) {
  return {
    type: 'TRANSLATE_FETCH_SUCCESS',
    translation: text,
    id
  };
}

export function translateData(text, id, source, target, lang) {
  return (dispatch) => {
    dispatch(translationIsLoading(true, id, lang));
    dispatch(translateHasErrored(false, id, lang));

    const data = {
      q: text,
      source: source,
      target: target
    };
    console.log(data);
    return fetch('/api/translate', {
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

        dispatch(translationIsLoading(false, id, lang));
        return response;
      })
      .then((response) => response.json())
      .then((resdata) => {
        dispatch(translateFetchTranslationSuccess(
          resdata.data.translations[0].translatedText,
          id,
          lang
        ));
      })
      .catch((e) => {
        // eslint-disable-next-line no-console
        console.warn('translateData error', e);
        dispatch(translateHasErrored(true, lang));
      });
  };
}
