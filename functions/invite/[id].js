const notFound=()=>new Response('Undangan tidak ditemukan atau masa tayangnya sudah berakhir.',{status:404,headers:{'content-type':'text/plain; charset=utf-8','cache-control':'no-store'}});
export async function onRequestGet(context) {
  const id=String(context.params.id || '');
  if(!/^[A-Za-z0-9_-]{8,80}$/.test(id))return notFound();
  try {
    const response=await fetch(`https://firestore.googleapis.com/v1/projects/${encodeURIComponent(context.env.FIREBASE_PROJECT_ID)}/databases/(default)/documents/invitations/${encodeURIComponent(id)}`,{signal:AbortSignal.timeout(10_000)});
    if(!response.ok)return notFound();
    const {fields={}}=await response.json();
    if(fields.status?.stringValue!=='published')return notFound();
    const content=fields.content?.mapValue?.fields || {};
    const name=person=>content[person]?.mapValue?.fields?.name?.stringValue || '';
    const names=[name('groom'),name('bride')].filter(Boolean).join(' & ') || 'Undangan Pernikahan';
    const title=`${names} — Undangan Pernikahan`;
    const date=content.weddingDate?.stringValue || '';
    const description=date ? `Kami menikah pada ${date}. Buka undangan pernikahan kami.` : 'Buka undangan pernikahan kami.';
    const url=new URL(context.request.url);url.search='';
    let image=content.coverImage?.stringValue || '/og-image.png';
    image=new URL(image,context.request.url).href;
    if(!image.startsWith('https://'))image=new URL('/og-image.png',context.request.url).href;
    const html=await context.env.ASSETS.fetch(new Request(new URL('/index.html',context.request.url)));
    const transformed=new HTMLRewriter()
      .on('title',{element(el){el.setInnerContent(title);}})
      .on('meta[property="og:title"]',{element(el){el.setAttribute('content',title);}})
      .on('meta[property="og:description"]',{element(el){el.setAttribute('content',description);}})
      .on('meta[name="description"]',{element(el){el.setAttribute('content',description);}})
      .on('meta[property="og:image"]',{element(el){el.setAttribute('content',image);}})
      .on('meta[property="og:url"]',{element(el){el.setAttribute('content',url.href);}})
      .transform(html);
    const headers=new Headers(transformed.headers);headers.set('cache-control','no-store');
    return new Response(transformed.body,{headers});
  }catch{return new Response('Undangan belum dapat dimuat. Silakan coba kembali.',{status:503,headers:{'cache-control':'no-store'}});}
}
