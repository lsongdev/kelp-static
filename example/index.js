const http = require('http');
const kelp = require('kelp');
const logs = require('kelp-logger');
const serve= require('../');

const app = kelp();

app.use(logs)
app.use(serve(__dirname, {
  index: true
}));

http.createServer(app).listen(3000);
