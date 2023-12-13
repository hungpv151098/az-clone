#!/usr/bin/env node

const http = require('http');
const config = require('./src/app.config');
const app = require('./src/app.server');
const { postgresqlConnect } = require('./src/models/postgres');

const { port, basePath } = config;
app.set('port', port);
Promise.all([postgresqlConnect()]).then(async () => {
  // require('./src/services/mail/mail')
});
const server = http.createServer(app);

server.listen(port);

server.on('listening', () => {
  console.log(`http://127.0.0.1:${port}`);
  console.log(`http://127.0.0.1:${port}${basePath}`);
});

server.on('error', e => {
  if (e.syscall !== 'listen') throw e;
  if (e.code === 'EACCES') {
    console.log('port privileges');
    process.exit(1);
  }
  if (e.code === 'EADDRINUSE') {
    console.log('port in use');
    process.exit(1);
  }
  throw e;
});
