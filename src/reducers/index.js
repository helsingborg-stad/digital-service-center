import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { startpage, startpageHasErrored, startpageIsLoading } from './startpage';
import { events, eventsHasErrored, eventsAreLoading, eventsCategories } from './events';
import { landingPages } from './landingPages';
import { iframeUrl } from './iframeUrl';
import { siteSettings } from './siteSettings';

export default combineReducers({
  startpage,
  startpageHasErrored,
  startpageIsLoading,
  events,
  eventsHasErrored,
  eventsAreLoading,
  eventsCategories,
  landingPages,
  iframeUrl,
  siteSettings,
  routing: routerReducer
});
