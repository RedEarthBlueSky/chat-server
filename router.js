'use strict';

const fs = require('fs');
const qs = require('qs');

let memory;   //  create
const dbFilePath = './db.json';

try {
  fs.writeFileSync(dbFilePath, JSON.stringify({db: []}), {encoding: 'utf8', flag: 'wx'});
} catch (e) {}

fs.readFile(dbFilePath, 'utf8', function (err, data) {
  memory = JSON.parse(data);
});

function dumpMemoryToDisk () {
  fs.writeFile(dbFilePath, JSON.stringify(memory), function (err) {
    if (err) throw err;
  });
}

setInterval(dumpMemoryToDisk, 10000);

function serve404 (res) {
  res.statusCode = 404;
  fs.readFile('./static/404.html', {encoding: 'utf8'}, function (err, data) {
    res.end(data);
  });
}

module.exports = function (req, res) {
  if (req.url === '/messages' && req.method === 'GET') {
    //  respond to GET request from /messages
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(memory.db.slice(-10)));
  } else if (req.url === '/messages' && req.method === 'POST') {
    //  respond to POST request from /messages
    let body = '';
    req.on('data', function (chunk) {
      body += chunk;
    }).on('end', function () {
      body = qs.parse(body);
      body.timestamp = Date.now();
      memory.db.push(body);
      res.end(JSON.stringify(body));
    });
  } else {
    // Catchall (serve static files)
    // if (!/\./.test(req.url)) req.url += '.html';
    if (req.url === '/') req.url = '/index.html';
    res.setHeader('Content-Type', 'text/html');
    fs.readFile('./static' + req.url, {encoding: 'utf8'}, function (err, data) {
      if (err) serve404(res);
      else res.end(data);
    });
  }
};
