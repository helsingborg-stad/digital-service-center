import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { activeLanguage } from './activeLanguage';
import { startpage, startpageHasErrored, startpageIsLoading } from './startpage';
import { events, eventsHasErrored, eventsAreLoading } from './events';
import { landingPages } from './landingPages';
import { iframeUrl } from './iframeUrl';
import { siteSettings } from './siteSettings';

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
  routing: routerReducer
});
