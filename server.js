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

// setup local state maintained in the server
server.app.lastChanged = Date.now();
server.app.dirty = false;

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

function periodicUploadChanges() {
  let p = Promise.resolve();

  console.log('periodicUploadChanges check...');
  if(server.app.dirty) {
    if((Date.now() - server.app.lastChanged) > 120 * 1000) {
      console.log('  cleaning up...');
      server.app.lastChanged = Date.now();
      server.app.dirty = false;
    }
  }

  p.then(() => setTimeout(periodicUploadChanges, 60 * 1000));
}

setTimeout(periodicUploadChanges, 60 * 1000);
