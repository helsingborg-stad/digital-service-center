// This file is appended to the service worker to
// make sure the app is automatically updated when
// a new release is available (instead of when
// all tabs are closed).
// `npm run build` is overridden to make sure this is appended after each build.
// See https://stackoverflow.com/questions/52904430/how-to-implement-skipwaiting-with-create-react-app

workbox.skipWaiting();
workbox.clientsClaim();
