CREATE TABLE IF NOT EXISTS payment_orders (
  id TEXT PRIMARY KEY,
  uid TEXT NOT NULL,
  invitation_id TEXT NOT NULL,
  variant_id TEXT NOT NULL,
  duration_months INTEGER NOT NULL,
  base_price INTEGER NOT NULL,
  extension_fee INTEGER NOT NULL DEFAULT 0,
  unique_code INTEGER NOT NULL,
  expected_total INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending_review', 'ai_match', 'active', 'rejected', 'refunded')),
  proof_key TEXT NOT NULL,
  ai_amount INTEGER,
  ai_confidence REAL NOT NULL DEFAULT 0,
  ai_summary TEXT,
  reviewed_by TEXT,
  reviewed_at TEXT,
  expires_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_payment_orders_uid_updated
  ON payment_orders (uid, updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_payment_orders_status_updated
  ON payment_orders (status, updated_at DESC);
