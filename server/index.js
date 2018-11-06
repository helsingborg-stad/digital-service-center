process.env.NODE_ENV = 'production';

require('es6-promise').polyfill();
require('isomorphic-fetch');

const http = require('http');
const path = require('path');
const fs = require('fs');
const express = require('express');

const app = express();
app.server = http.createServer(app);
app.use(express.static('../build'));

const staticFiles = [
  '/static/*',
  '/logo.svg',
  '/asset-manifest.json',
  '/favicon.ico',
  '/service-worker.js',
  '/precache-manifest.*.js'
];

staticFiles.forEach(file => {
  app.get(file, (req, res) => {
    const filePath = path.join(__dirname, '../build', req.url);
    res.sendFile(filePath);
  });
});

app.get('/api/*', (req, res) => {
  const url = `http://helsingborg-dsc.test/wp-json/wp/v2/${req.url.slice('/api/'.length)}`;
  fetch(url).then(response => response.json()).then(x => res.status(200).send(x));
});

app.get('*', (req, res, next) => {
  const htmlFilePath = path.join(__dirname, '../build', 'index.html');
  fs.readFile(htmlFilePath, 'utf8', (err, htmlData) => {
    if (err) {
      res.status(404).send('404');
    } else {
      res.status(200).send(htmlData);
    }
  });
});

// eslint-disable-next-line no-process-env
app.server.listen(process.env.PORT || 8080);

//eslint-disable-next-line no-console
console.log(`Listening on http://localhost:${app.server.address().port}`);
