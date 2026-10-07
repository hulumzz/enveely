export function publicPaymentOrder(row) {
  const time = value=>value ? Date.parse(value) : null;
  return {id:row.id,invitationId:row.invitation_id,variantId:row.variant_id,ownerUid:row.uid,templateId:row.variant_id?.split('-')[0],durationMonths:row.duration_months,basePrice:row.base_price,extensionFee:row.extension_fee,uniqueCode:row.unique_code,subtotal:row.expected_total-row.unique_code,total:row.expected_total,status:row.status,createdAt:time(row.created_at),updatedAt:time(row.updated_at),expiresAt:time(row.expires_at),reviewedAt:time(row.reviewed_at),verification:{confidence:row.ai_confidence || 0,summary:row.ai_summary || ''}};
}
