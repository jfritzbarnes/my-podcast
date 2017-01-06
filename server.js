'use strict';

const Hapi = require('hapi');
const MemMirror = require('mem-mirror');

const server = new Hapi.Server();
const connOpts = {
  port: 9090,
  routes: {
    cors: {
      origin: ['*'],
      additionalHeaders: ['accept-language', 'cache-control', 'accept-encoding', 'upgrade-insecure-requests', 'user-agent', 'host'],
    },
  },
}
server.connection(connOpts);

var opts = {
  addSimpleUIRoutes: true,
  dropboxClientID: 'wn1w3gfvtx2gn26',
  nodeModulesPath: '../..',
};
const mm = new MemMirror(server, opts);

const plugins = [
  require('./config/logs'),
  require('./config/routes'),
];

server.register(plugins)
.then(() => mm.prepare())
.then(() => server.start())
.then(() => {
  console.log(`Server running at: ${server.info.uri}`);
})
.catch((err) => {
  console.log(`Server start error: ${err.message}`);
  console.log(err);
});
