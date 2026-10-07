CREATE TABLE IF NOT EXISTS request_limits (
  uid TEXT NOT NULL,
  scope TEXT NOT NULL,
  window_start INTEGER NOT NULL,
  count INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY (uid, scope)
);
ALTER TABLE payment_orders ADD COLUMN review_token TEXT;
ALTER TABLE payment_orders ADD COLUMN review_started_at TEXT;
