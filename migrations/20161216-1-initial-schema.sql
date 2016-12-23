-- Up
CREATE TABLE feed (
  id TEXT NOT NULL,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  active BOOLEAN NOT NULL CHECK (active IN (0,1)),
  last_viewed REAL NOT NULL
);

-- Down
DROP TABLe feed;
