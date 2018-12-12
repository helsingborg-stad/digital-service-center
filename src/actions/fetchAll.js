import { siteSettings as siteSettingsDispatch } from '../actions/siteSettings';
import { eventsFetchData } from '../actions/events';
import { crmFetchData } from '../actions/crm';
import { startpageFetchData } from '../actions/startpage';

export async function fetchAll(store) {
  if (!cacheIsStale() || !navigator.onLine) {
    return;
  }

  setNewCacheTimestamp();

  const res = await fetch('/api/site-settings');
  const siteSettings = await res.json();
  store.dispatch(siteSettingsDispatch(siteSettings));

  const languages = store.getState().siteSettings.languages.map(l => l.shortName);

  languages.forEach(lang => {
    store.dispatch(eventsFetchData('/api/events', lang));
    store.dispatch(startpageFetchData('/api/startpage', lang));
  });

  store.dispatch(crmFetchData('/api/temp-crm'));
}

function cacheIsStale() {
  if (!window.localStorage['hdsc-cache-timestamp']) {
    setNewCacheTimestamp();
    return true;
  }

  const timestamp = new Date(window.localStorage['hdsc-cache-timestamp']);
  const fiveMinutes = 5 * 60 * 1000;
  return ((new Date()) - timestamp) > fiveMinutes;
}

function setNewCacheTimestamp() {
  window.localStorage.setItem('hdsc-cache-timestamp', new Date().toJSON());
}
