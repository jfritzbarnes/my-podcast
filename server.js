'use strict';

const Hapi = require('hapi');
const MemMirror = require('mem-mirror');

const server = new Hapi.Server();
server.connection({port: 9090});

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
