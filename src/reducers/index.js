import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { startpage, startpageHasErrored, startpageIsLoading } from './startpage';
import { events, eventsHasErrored, eventsAreLoading } from './events';
import { landingPages } from './landingPages';
import { iframeUrl } from './iframeUrl';

export default combineReducers({
  startpage,
  startpageHasErrored,
  startpageIsLoading,
  events,
  eventsHasErrored,
  eventsAreLoading,
  landingPages,
  iframeUrl,
  routing: routerReducer
});
