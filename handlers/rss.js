'use strict';

const Feed = require('../src/feed.js');
const shortid = require('shortid');

function markDirty(server) {
  server.app.dirty = true;
  server.app.lastChanged = Date.now();
}

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

  const selectFeed = 'SELECT * FROM feed WHERE id=?';
  let data = null;
  return req.db.get(selectFeed, [req.params.feedId])
  .then((row) => {
    data = row;
    const selectItems = "SELECT * FROM items WHERE feed_id=? ORDER BY pubdate";
    return req.db.all(selectItems, [req.params.feedId]);
  })
  .then((items) => {
    data.items = items;
    return reply({status: 'success', data: data});
  })
  .catch((e) => {
    console.log('get feed items error', e);
    return reply({status: 'fail', message: e.message});
  });
}

exports.loadFeed = function(req, reply) {
  if(!req.server.app.memMirror.ready) {
    return reply({status: 'fail', message: 'server is not ready'});
  }

  req.server.app.lastChanged = Date.now();

  const sql = 'SELECT * FROM feed WHERE id=?';
  let data = null;
  return req.db.get(sql, [req.params.feedId])
  .then((row) => {
    data = row;
    const feed = new Feed(row.url);
    return feed.fetch();
  })
  .then((f) => {
    return f.storeItemsInDB(req.db, req.params.feedId);
  })
  .then((f) => {
    //console.log('feed', JSON.stringify(f, null, 2));
    data.items = f.items;
    return reply({status: 'success', data: data});
  })
  .catch((e) => {
    console.log(e);
    return reply({status: 'fail', message: e.message});
  });
}

exports.addFeed = function(req, reply) {
  if(!req.server.app.memMirror.ready) {
    return reply({status: 'fail', message: 'server is not ready'});
  }

  req.server.app.lastChanged = Date.now();

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

  req.server.app.lastChanged = Date.now();

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

exports.updateItem = function(req, reply) {
  if(!req.server.app.memMirror.ready) {
    return reply({status: 'fail', message: 'server is not ready'});
  }

  req.server.app.lastChanged = Date.now();

  const getSql = 'SELECT * FROM items WHERE id=?';
  return req.db.get(getSql, [req.params.itemId])
  .then((row) => {
    if(!row) throw new Error('item not found');

    let updateSql, params;
    if(req.payload.inMyFeed && !row.inMyFeed) {
      updateSql = 'UPDATE items SET viewed=?, in_my_feed=?, inserted_date=? WHERE id=?';
      params = [
        req.payload.viewed,
        req.payload.inMyFeed,
        Date.now(),
        req.params.itemId
      ];
    } else {
      updateSql = 'UPDATE items SET viewed=?, in_my_feed=? WHERE id=?';
      params = [
        req.payload.viewed,
        req.payload.inMyFeed,
        req.params.itemId
      ];
    }
    return req.db.run(updateSql, params)
    .then((results) => {
      if(results.stmt.changes === 0) {
        return reply({status: 'fail', message: 'not found'});
      } else {
        return reply({status: 'success', message: 'row updated'});
      }
    })
  })
  .catch((e) => {
    return reply({status: 'fail', message: e.message});
  });
}
