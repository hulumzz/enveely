export function validImageBytes(buffer,type) {
 const bytes=new Uint8Array(buffer);
 if(type==='image/jpeg')return bytes.length>=3 && bytes[0]===255 && bytes[1]===216 && bytes[2]===255;
 if(type==='image/png')return bytes.length>=8 && [137,80,78,71,13,10,26,10].every((v,i)=>bytes[i]===v);
 if(type==='image/webp')return bytes.length>=12 && String.fromCharCode(...bytes.slice(0,4))==='RIFF' && String.fromCharCode(...bytes.slice(8,12))==='WEBP';
 return false;
}
export async function sha256(buffer) {return [...new Uint8Array(await crypto.subtle.digest('SHA-256',buffer))].map(b=>b.toString(16).padStart(2,'0')).join('');}
