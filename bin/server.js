#!/usr/bin/env node

'use strict';
const http   = require('http');
const kelp   = require('kelp');
const serve  = require('../');
const logger = require('kelp-logger');

const app = kelp();

app.use(logger);
app.use(serve(process.cwd()));
app.use(function(req, res){
  res.end('Not Found');
});

const server = http.createServer(app);

server.listen(process.env.PORT || 8000, function(){
  console.log('server is running at %j', server.address().port);
});