-- Aggregate product analytics are opt-in, without wedding content or user identity.
CREATE TABLE IF NOT EXISTS analytics_daily (
 day TEXT NOT NULL,event TEXT NOT NULL,template_id TEXT NOT NULL DEFAULT '',count INTEGER NOT NULL DEFAULT 0,
 PRIMARY KEY(day,event,template_id)
);
CREATE TABLE IF NOT EXISTS analytics_events (
 event_hash TEXT PRIMARY KEY,day TEXT NOT NULL,event TEXT NOT NULL,template_id TEXT NOT NULL DEFAULT '',visitor_hash TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_analytics_events_day ON analytics_events(day);
CREATE TABLE IF NOT EXISTS analytics_sessions (
 day TEXT NOT NULL,visitor_hash TEXT NOT NULL,PRIMARY KEY(day,visitor_hash)
);
CREATE TABLE IF NOT EXISTS customer_reviews (
 id TEXT PRIMARY KEY,uid TEXT UNIQUE,invitation_id TEXT,display_name TEXT NOT NULL,rating INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5),
 message TEXT NOT NULL,public_consent INTEGER NOT NULL DEFAULT 0 CHECK(public_consent IN (0,1)),
 status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','approved','hidden')),
 source TEXT NOT NULL DEFAULT 'account' CHECK(source IN ('account','external')),
 created_at TEXT NOT NULL,updated_at TEXT NOT NULL,reviewed_by TEXT,reviewed_at TEXT
);
CREATE INDEX IF NOT EXISTS idx_customer_reviews_status ON customer_reviews(status,updated_at DESC);
