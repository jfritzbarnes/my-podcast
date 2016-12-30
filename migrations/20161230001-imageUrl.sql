-- up
ALTER TABLE feed ADD COLUMN image_url text;

-- down
ALTER TABLE feed RENAME TO old_feed;
CREATE TABLE feed (
  id TEXT NOT NULL,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  active BOOLEAN NOT NULL CHECK (active IN (0,1)),
  last_viewed REAL NOT NULL
);
INSERT INTO feed
  SELECT id, name, url, active, last_viewed FROM old_feed;
DROP TABLE IF EXISTS old_feed;
