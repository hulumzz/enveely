export function timestampMillis(value) {
  if (typeof value?.toMillis === 'function') return value.toMillis();
  if (typeof value?.seconds === 'number') return value.seconds * 1000;
  if (typeof value === 'number') return value;
  return typeof value === 'string' ? Date.parse(value) : 0;
}
export function isInvitationLive(draft, orders = [], now = Date.now()) {
  if (draft.status !== 'published') return false;
  if (draft.design?.variantId === 'serena-paper') {
    const started = timestampMillis(draft.freeActivatedAt) || timestampMillis(draft.publishedAt);
    return Boolean(started && started + 7 * 86400000 > now);
  }
  return orders.some(order => order.invitationId === draft.id
    && order.variantId === draft.design?.variantId && order.status === 'active'
    && timestampMillis(order.expiresAt) > now);
}
