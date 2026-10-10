const CSP=[
 "default-src 'self'", "base-uri 'self'", "object-src 'none'", "frame-ancestors 'self'", "form-action 'self'",
 "script-src 'self' https://challenges.cloudflare.com https://www.gstatic.com https://apis.google.com https://www.googletagmanager.com",
 "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
 "font-src 'self' https://fonts.gstatic.com data:",
 "img-src 'self' https: data: blob:", "media-src 'self' https: blob:",
 "connect-src 'self' https://*.googleapis.com https://*.firebaseio.com wss://*.firebaseio.com https://*.firebaseapp.com https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com https://challenges.cloudflare.com",
 "frame-src 'self' https://*.firebaseapp.com https://accounts.google.com https://www.google.com https://maps.google.com https://challenges.cloudflare.com",
 "upgrade-insecure-requests",
].join('; ');
export async function onRequest(context) {
 const result=await context.next(),response=new Response(result.body,result);
 response.headers.set('content-security-policy',CSP);
 response.headers.set('x-content-type-options','nosniff');response.headers.set('referrer-policy','strict-origin-when-cross-origin');response.headers.set('x-frame-options','SAMEORIGIN');response.headers.set('permissions-policy','camera=(), microphone=(), geolocation=()');response.headers.set('cross-origin-opener-policy','same-origin-allow-popups');
 if(new URL(context.request.url).pathname.startsWith('/api/'))response.headers.set('cache-control','no-store');
 return response;
}
