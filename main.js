'use strict';

const http = require('http');

const router = require('./router.js');

const hostname = 'localhost';
const port = 3000;

const server = http.createServer(router);

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
