-- Rebuild to extend the CHECK constraint while retaining every existing order.
CREATE TABLE payment_orders_v3 (
 id TEXT PRIMARY KEY, uid TEXT NOT NULL, invitation_id TEXT NOT NULL, variant_id TEXT NOT NULL,
 duration_months INTEGER NOT NULL, base_price INTEGER NOT NULL, extension_fee INTEGER NOT NULL DEFAULT 0,
 unique_code INTEGER NOT NULL, expected_total INTEGER NOT NULL,
 status TEXT NOT NULL CHECK(status IN ('draft','pending_review','ai_match','activation_pending','active','rejected','refunded')),
 proof_key TEXT NOT NULL DEFAULT '', ai_amount INTEGER, ai_confidence REAL NOT NULL DEFAULT 0, ai_summary TEXT,
 reviewed_by TEXT, reviewed_at TEXT, expires_at TEXT, created_at TEXT NOT NULL, updated_at TEXT NOT NULL,
 review_token TEXT, review_started_at TEXT, proof_hash TEXT, transaction_ref TEXT, ai_transaction_ref TEXT,
 activation_started_at TEXT, activation_error TEXT
);
INSERT INTO payment_orders_v3(id,uid,invitation_id,variant_id,duration_months,base_price,extension_fee,unique_code,expected_total,status,proof_key,ai_amount,ai_confidence,ai_summary,reviewed_by,reviewed_at,expires_at,created_at,updated_at,review_token,review_started_at)
 SELECT id,uid,invitation_id,variant_id,duration_months,base_price,extension_fee,unique_code,expected_total,status,proof_key,ai_amount,ai_confidence,ai_summary,reviewed_by,reviewed_at,expires_at,created_at,updated_at,review_token,review_started_at FROM payment_orders;
DROP TABLE payment_orders;
ALTER TABLE payment_orders_v3 RENAME TO payment_orders;
CREATE INDEX idx_payment_orders_uid_updated ON payment_orders(uid,updated_at DESC);
CREATE INDEX idx_payment_orders_status_updated ON payment_orders(status,updated_at DESC);
CREATE INDEX idx_payment_orders_invitation ON payment_orders(invitation_id,updated_at DESC);
CREATE UNIQUE INDEX idx_transaction_ref ON payment_orders(transaction_ref) WHERE transaction_ref IS NOT NULL;
CREATE TABLE activation_locks(invitation_id TEXT PRIMARY KEY, order_id TEXT NOT NULL UNIQUE, created_at TEXT NOT NULL);
CREATE TABLE media_assets(key TEXT PRIMARY KEY,uid TEXT NOT NULL,invitation_id TEXT NOT NULL,bytes INTEGER NOT NULL,created_at TEXT NOT NULL);
CREATE INDEX idx_media_owner ON media_assets(uid);
CREATE INDEX idx_media_invitation ON media_assets(invitation_id);
CREATE TABLE maintenance_locks(name TEXT PRIMARY KEY,token TEXT NOT NULL,expires_at INTEGER NOT NULL);
CREATE UNIQUE INDEX idx_one_open_checkout ON payment_orders(uid,invitation_id) WHERE status IN ('draft','pending_review','ai_match','activation_pending');
CREATE UNIQUE INDEX idx_proof_hash ON payment_orders(proof_hash) WHERE proof_hash IS NOT NULL AND status <> 'rejected';
CREATE TABLE deletion_jobs(id TEXT PRIMARY KEY,uid TEXT NOT NULL,created_at TEXT NOT NULL,r2_cursor TEXT);
CREATE TABLE maintenance_state(name TEXT PRIMARY KEY,value TEXT NOT NULL);
