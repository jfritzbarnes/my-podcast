'use strict';

const _ = require('lodash');
const rss = require('rss');
//const S3 = require('node-s3');
const S3FS = require('s3fs');

exports.createFeed = function(req, reply) {
  if(!req.server.app.memMirror.ready) {
    return reply({status: 'fail', message: 'server is not ready'});
  }

  const sql = `SELECT f.name, i.* FROM items AS i, feed AS f
    WHERE i.in_my_feed == 1 AND f.id == i.feed_id
    ORDER BY i.pubdate DESC`;
  return req.db.all(sql)
  .then((data) => {
    var feed = new rss({
      title: 'Curated Podcasts for Fritz',
      generator: 'MyPodcast',
    });

    _.forEach(data, (row) => {
      feed.item({
        title: row.title,
        description: row.name + ': ' + row.description,
        date: new Date(row.pubdate),
        author: row.name,
        guid: row.id,
        enclosure: {
          url: row.enclosure_url,
          size: row.enclosure_length,
          type: row.enclosure_type,
        },
      });
    });
    const xml = feed.xml();
    const opts = { region: 'us-west-2', };
    var s3fs = new S3FS('aidanfritz', opts);
    return s3fs.writeFile('mypodcast/feed.rss', xml)
    .then(() => {
      return reply({status: 'success', data: {xml}});
    })
  })
  .catch((e) => {
    console.log('createFeed failed:', e);
    return reply({status: 'fail', message: e.message});
  });
}
