import { combineReducers } from 'redux';
import { startpage, startpageHasErrored, startpageIsLoading } from './startpage';

export default combineReducers({
  startpage,
  startpageHasErrored,
  startpageIsLoading
});
