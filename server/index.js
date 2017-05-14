process.env['NODE_ENV'] = 'production';

require('import-export');
require('babel-core/register')({ presets: ['react-app'] });
require('ignore-styles');
require('es6-promise').polyfill();
require('isomorphic-fetch');

const fetchIntercept = require('fetch-intercept');

// Replace all calls to /api/ to the WordPress back-end
fetchIntercept.register({
  request: (url, config) => {
    let newUrl = url;
    if (url.startsWith('/api/')) {
      newUrl = 'http://helsingborg-dsc.local/wp-json/wp/v2/' + newUrl.slice('/api/'.length);
    }
    return [newUrl, config];
  }
});

const http = require('http');
const path = require('path');
const fs = require('fs');
const express = require('express');
const react = require('react');
const reactDomServer = require('react-dom/server');
const reactRouter = require('react-router');
const reactRedux = require('react-redux');

const renderToString = reactDomServer.renderToString;
const createElement = react.createElement;
const match = reactRouter.match;
const RouterContext = reactRouter.RouterContext;
const Provider = reactRedux.Provider;

const store = require('../src/store/configureStore').default();
const routes = require('../src/routes').default();
const { activeLanguage } = require('../src/actions/activeLanguage');

const app = express();
app.server = http.createServer(app);
app.use(express.static('../build'));

const staticFiles = [
  '/static/*',
  '/logo.svg',
  '/asset-manifest.json',
  '/favicon.ico'
];

staticFiles.forEach(file => {
  app.get(file, (req, res) => {
    const filePath = path.join(__dirname, '../build', req.url);
    res.sendFile(filePath);
  });
});

app.get('/api/*', (req, res) => {
  const url = `http://helsingborg-dsc.local/wp-json/wp/v2/${req.url.slice('/api/'.length)}`;
  fetch(url).then(response => response.json()).then(x => res.status(200).send(x));
});

app.get('*', (req, res, next) => {
  const error = () => res.status(404).send('404');
  const htmlFilePath = path.join(__dirname, '../build', 'index.html');

  // If images are `import`:ed and used as `src`, they get serialized
  // to '[object Object]', which get redirected to '/', so we manually give the request a 404.
  // TODO: find out if there's a way to actually bundle the assets themself
  if (req.url === '/[object%20Object]') {
    error();
    return;
  }

  fs.readFile(htmlFilePath, 'utf8', (err, htmlData) => {
    if (err) {
      error();
    } else {
      match({ routes, location: req.url }, (matchErr, redirect, renderProps) => {
        if (matchErr) {
          error();
        } else if (redirect) {
          res.redirect(302, redirect.pathname + redirect.search);
        } else if (renderProps) {
          // Set `activeLanguage` store property based requested URL
          let langFromUrl = req.params[0].replace(/\//g, '');
          const validLanguages = ['sv', 'en']; // TODO: make dynamic
          if (!validLanguages.includes(langFromUrl)) {
            res.redirect(302, '/');
            next();
            return;
          }
          store.dispatch(activeLanguage(langFromUrl));

          const components = renderProps.components;

          const Comp = components[components.length - 1].WrappedComponent;
          const fetchData = (Comp && Comp.fetchData) || (() => Promise.resolve());

          const fetchSiteSettings = fetch('/api/site-settings').then(x => x.json());

          const { location, params, history } = renderProps;

          // Fetch site settings from API, then wait for eventual fetchData method on
          // active router component to resolve, so we can pre-render the app.
          // TODO: Make fetchData and fetchSiteSettings get called simultaneously;
          // right now we wait for fetchSiteSettings to resolve before we call fetchData
          fetchSiteSettings.then((siteSettings) => {
            store.dispatch({type: 'SITE_SETTINGS', siteSettings});
            fetchData({ store, location, params, history })
              .then(() => {
                const state = store.getState();

                const renderedApp = renderToString(
                  createElement(Provider, {store},
                    createElement(RouterContext, renderProps)
                  )
                ) + `<script>window.__REDUX_STATE__ = ${JSON.stringify(state)}</script>`;

                const RenderedApp = htmlData
                  .replace('<div style="display:none">{{SSR}}</div>', renderedApp);
                res.status(200).send(RenderedApp);
              });
          })
          .catch(() => error());
        } else {
          error();
        }
      });
    }
  });
});

// eslint-disable-next-line no-process-env
app.server.listen(process.env.PORT || 8080);

//eslint-disable-next-line no-console
console.log(`Listening on http://localhost:${app.server.address().port}`);
