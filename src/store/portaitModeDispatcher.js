import { isInPortraitMode } from '../actions/isInPortraitMode';

const portraitMediaQuery = typeof window !== 'undefined'
  && window.matchMedia && window.matchMedia('(orientation: portrait)');

export default function (store) {
  if (portraitMediaQuery) {
    store.dispatch(isInPortraitMode(portraitMediaQuery.matches));

    portraitMediaQuery.addListener((query) => {
      store.dispatch(isInPortraitMode(query.matches));
    });
  }
}
