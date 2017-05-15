'use strict';

const _ = require('lodash');
const rss = require('rss');
const S3FS = require('s3fs');
const Feed = require('../src/feed');
const moment = require('moment');

exports.getFeed = function(req, reply) {
  if(!req.server.app.memMirror.ready) {
    return reply({status: 'fail', message: 'server is not ready'});
  }

  return Feed.getFeedItemsFromDB(req.db)
  .then((data) => {
    return reply({status: 'success', data: data});
  })
  .catch((e) => {
    console.log('createFeed failed:', e);
    return reply({status: 'fail', message: e.message});
  });
}

exports.createFeed = function(req, reply) {
  if(!req.server.app.memMirror.ready) {
    return reply({status: 'fail', message: 'server is not ready'});
  }

  return Feed.getFeedItemsFromDB(req.db)
  .then((data) => {
    var feed = new rss({
      title: 'Curated Podcasts for Fritz',
      generator: 'MyPodcast',
    });

    _.forEach(data, (row) => {
      const m = moment(row.pubDate);
      const origPublish = ' (originally published: ' + m.format('DDMMM') + ')';
      feed.item({
        title: row.title,
        description: row.name + ': ' + row.description + origPublish,
        date: new Date(row.inserted_date),
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
