-- up
ALTER TABLE items ADD COLUMN inserted_date REAL NOT NULL DEFAULT 0;

-- down
ALTER TABLE items RENAME TO old_items;
CREATE TABLE items (
  id TEXT NOT NULL,
  guid TEXT NOT NULL,
  feed_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  pubdate REAL NOT NULL,
  url TEXT,
  enclosure_length INTEGER NOT NULL,
  enclosure_type TEXT NOT NULL,
  enclosure_url TEXT NOT NULL,
  viewed BOOLEAN NOT NULL CHECK(viewed IN (0,1)) DEFAULT 0,
  in_my_feed BOOLEAN NOT NULL CHECK(in_my_feed IN (0,1)) DEFAULT 0
);
INSERT INTO items
  SELECT id, guid, feed_id, title, description, pubdate, url, enclosure_length,
    enclosure_type, enclosure_url, viewed, in_my_feed FROM old_items;
DROP TABLE IF EXISTS old_items;
