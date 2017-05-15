const FeedParser = require('feedparser');
const request = require('request');
const striptags = require('striptags');
const lodash = require('lodash');
const shortid = require('shortid');

class Feed {
  constructor(feedUrl) {
    this.url = feedUrl;
    this.items = [];
    this.meta = {};
  }

  fetch() {
    const req = request(this.url);
    const feedParser = new FeedParser({addMeta: false});

    return new Promise((fulfill, reject) => {
      req.on('error', reject);
      req.on('response', (res) => {
        if(res.statusCode != 200) return reject();
        res.pipe(feedParser);
      });

      feedParser.on('error', reject);
      feedParser.on('end', () => {
        fulfill(this);
      });
      feedParser.on('meta', (meta) => {
        this.meta.title = striptags(meta.title);
        this.meta.description = striptags(meta.description);
        this.meta.imageUrl = meta.image.url;
      });
      feedParser.on('data', (data) => {
        const item = {
          title: striptags(data.title),
          description: striptags(data.description),
          url: data.link,
          guid: data.guid,
          enclosure: data.enclosures[0],
          pubdate: data.pubdate,
        };
        this.items.push(item);
      });
    });
  }

  storeItemsInDB(db, feedId) {
    const promises = [];
    lodash.forEach(this.items, (item) => {
      const select = 'SELECT * FROM items WHERE guid=? AND feed_id=?';
      const p = db.get(select, [item.guid, feedId])
      .then((row) => {
        if(row) return true;
        if(!item.enclosure) {
          console.log('missing enclosure', item);
          return true;
        }

        const insert = `INSERT INTO items
          (id, guid, feed_id, title, description, pubdate, url, enclosure_length,
           enclosure_type, enclosure_url, viewed, in_my_feed)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const params = [
          shortid.generate(),
          item.guid,
          feedId,
          item.title,
          item.description,
          Date.parse(item.pubdate),
          item.url,
          item.enclosure.length,
          item.enclosure.type,
          item.enclosure.url,
          0,
          0
        ];
        return db.run(insert, params);
      });
      promises.push(p);
    });

    return Promise.all(promises)
    .then(() => {
      return this;
    });
  }
}

Feed.getFeedItemsFromDB = function getFeedItemsFromDB(db) {
  const sql = `SELECT f.name, i.* FROM items AS i, feed AS f
    WHERE i.in_my_feed == 1 AND f.id == i.feed_id
    ORDER BY i.inserted_date DESC
    LIMIT 20`;
  return db.all(sql);
}

module.exports = Feed;
