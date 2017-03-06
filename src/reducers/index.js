import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { startpage, startpageHasErrored, startpageIsLoading } from './startpage';

export default combineReducers({
  startpage,
  startpageHasErrored,
  startpageIsLoading,
  routing: routerReducer
});
