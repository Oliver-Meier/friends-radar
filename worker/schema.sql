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

-- Telegram subscriptions table for push notifications
CREATE TABLE IF NOT EXISTS telegram_subscriptions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  chatId TEXT NOT NULL UNIQUE,
  userId TEXT,
  username TEXT,
  firstName TEXT,
  isActive INTEGER DEFAULT 1,
  notifyTime TEXT DEFAULT '09:00',
  timezone TEXT DEFAULT 'Europe/Berlin',
  createdAt INTEGER DEFAULT (unixepoch() * 1000),
  updatedAt INTEGER DEFAULT (unixepoch() * 1000)
);

-- Index for active subscriptions
CREATE INDEX IF NOT EXISTS idx_telegram_active ON telegram_subscriptions(isActive);

-- Index for linking Telegram to app user
CREATE INDEX IF NOT EXISTS idx_telegram_userId ON telegram_subscriptions(userId);
