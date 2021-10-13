#!/usr/bin/env node

'use strict';
const http = require('http');
const kelp = require('kelp');
const logger = require('kelp-logger');
const serve = require('..');

const app = kelp();

app.use(logger);
app.use(serve('.', { listDirectory: true }));
app.use((_, res) => res.end('Not Found'));

const server = http.createServer(app);
server.listen(process.env.PORT || 8000, function () {
  console.log('server is running at %j', server.address().port);
});