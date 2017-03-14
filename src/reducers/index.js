import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { startpage, startpageHasErrored, startpageIsLoading } from './startpage';
import { events, eventsHasErrored, eventsAreLoading } from './events';

export default combineReducers({
  startpage,
  startpageHasErrored,
  startpageIsLoading,
  events,
  eventsHasErrored,
  eventsAreLoading,
  routing: routerReducer
});
