-- Up
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

-- Down
DROP TABLE items;
