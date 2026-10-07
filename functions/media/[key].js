export async function onRequestGet(context) {
  const key = String(context.params.key || '');
  if (!/^[a-f0-9-]{36}\.(jpg|png|webp)$/.test(key) || !context.env.INVITATION_MEDIA) return new Response('Not found',{status:404});
  const object = await context.env.INVITATION_MEDIA.get(key);
  if (!object) return new Response('Not found',{status:404});
  const headers = new Headers({'cache-control':'public, max-age=86400','x-content-type-options':'nosniff'});
  object.writeHttpMetadata(headers);
  headers.set('etag',object.httpEtag);
  return new Response(object.body,{headers});
}
