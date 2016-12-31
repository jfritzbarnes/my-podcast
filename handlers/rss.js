'use strict';

const Feed = require('../src/feed.js');
const shortid = require('shortid');

exports.getAllFeeds = function(req, reply) {
  if(!req.server.app.memMirror.ready) {
    return reply({status: 'fail', message: 'server is not ready'});
  }

  // perform query
  const sql = 'SELECT * FROM feed';
  return req.db.all(sql)
  .then((data) => {
    return reply({status: 'success', data: data});
  })
  .catch((e) => {
    return reply({status: 'fail', message: e.message});
  });
}

exports.getFeed = function(req, reply) {
  if(!req.server.app.memMirror.ready) {
    return reply({status: 'fail', message: 'server is not ready'});
  }

  return reply({status: 'fail', message: 'server unimplemented'});
}

exports.addFeed = function(req, reply) {
  if(!req.server.app.memMirror.ready) {
    return reply({status: 'fail', message: 'server is not ready'});
  }

  const feed = new Feed(req.payload.feedUrl);

  // ensure that feed doesn't already exist
  const select = 'SELECT * FROM feed WHERE url=?';
  return req.db.get(select, req.payload.feedUrl)
  .then((row) => {
    console.log(row);
    if(row) throw new Error('feed already exists');

    return feed.fetch();
  })
  .then((f) => {
    console.log('feed', JSON.stringify(f, null, 2));

    const sql = `INSERT INTO feed
      (id, name, url, active, last_viewed, image_url)
      VALUES (?, ?, ?, ?, ?, ?)`;
    const params = [shortid.generate(), f.meta.title, f.url, true, Date.now(), f.meta.imageUrl];
    return req.db.run(sql, params);
  })
  .then(() => {
    return reply({status: 'success', message: 'add feed'});
  })
  .catch((e) => {
    return reply({status: 'fail', message: e.message});
  });
}

exports.updateFeed = function(req, reply) {
  if(!req.server.app.memMirror.ready) {
    return reply({status: 'fail', message: 'server is not ready'});
  }
}

exports.deleteFeed = function(req, reply) {
  if(!req.server.app.memMirror.ready) {
    return reply({status: 'fail', message: 'server is not ready'});
  }

  const sql = 'DELETE FROM feed WHERE id=?';
  return req.db.run(sql, [req.params.feedId])
  .then((results) => {
    if(resuls.stmt.changes === 0) {
      return reply({status: 'fail', message: 'not found'});
    } else {
      return reply({status: 'success', message: 'row deleted'});
    }
  })
  .catch((e) => {
    return reply({status: 'fail', message: e.message});
  });
}
