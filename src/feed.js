const FeedParser = require('feedparser');
const request = require('request');
const striptags = require('striptags');

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
        };
        this.items.push(item);
      });
    });
  }
}

module.exports = Feed;
