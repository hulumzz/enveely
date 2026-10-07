export async function consumeQuota(env,uid,scope,max,windowSeconds=3600) {
  if (!env.PAYMENTS_DB) return false;
  const window = Math.floor(Date.now()/1000/windowSeconds)*windowSeconds;
  const row=await env.PAYMENTS_DB.prepare(`INSERT INTO request_limits (uid,scope,window_start,count) VALUES (?,?,?,1)
    ON CONFLICT(uid,scope) DO UPDATE SET window_start=excluded.window_start,
      count=CASE WHEN request_limits.window_start=excluded.window_start THEN request_limits.count+1 ELSE 1 END
    RETURNING count`).bind(uid,scope,window).first();
  return Number(row?.count)<=max;
}
