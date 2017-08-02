'use strict';

exports.getState = function(req, reply) {
  const data = {
    ready: req.server.app.memMirror.ready,
    dirty: req.server.app.dirty,
    secondsSinceLastChange: (Date.now() - req.server.app.lastChanged) / 1000,
  };
  return reply({status: 'success', data});
};

exports.dirtyFudge = function(req, reply) {
  req.server.app.lastChanged = Date.now();
  req.server.app.dirty = true;

  return reply({status: 'success'});
}
