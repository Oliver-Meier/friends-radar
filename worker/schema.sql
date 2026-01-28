-- D1 Database Schema for Friends Radar

CREATE TABLE IF NOT EXISTS friends (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  name TEXT NOT NULL,
  lastContact INTEGER NOT NULL,
  updatedAt INTEGER NOT NULL,
  createdAt INTEGER DEFAULT (unixepoch() * 1000)
);

-- Index for efficient user queries
CREATE INDEX IF NOT EXISTS idx_friends_userId ON friends(userId);

-- Index for sorting by name
CREATE INDEX IF NOT EXISTS idx_friends_name ON friends(userId, name);
