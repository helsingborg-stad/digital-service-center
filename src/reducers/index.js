import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { activeLanguage } from './activeLanguage';
import { startpage, startpageHasErrored, startpageIsLoading } from './startpage';
import { events, eventsHasErrored, eventsAreLoading } from './events';
import { landingPages } from './landingPages';
import { iframeUrl } from './iframeUrl';
import { siteSettings } from './siteSettings';
import { hbgSeSearch } from './hbgSeSearch';
import { addressSearch } from './addressSearch';
import { previousUrl } from './previousUrl';
import { crm } from './crm';
import { isInPortraitMode } from './isInPortraitMode';
import { translation } from './translate';

export default combineReducers({
  activeLanguage,
  startpage,
  startpageHasErrored,
  startpageIsLoading,
  events,
  eventsHasErrored,
  eventsAreLoading,
  landingPages,
  iframeUrl,
  siteSettings,
  hbgSeSearch,
  addressSearch,
  previousUrl,
  crm,
  isInPortraitMode,
  translation,
  routing: routerReducer
});
