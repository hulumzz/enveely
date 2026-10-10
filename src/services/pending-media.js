async function database(){return new Promise((resolve,reject)=>{const req=indexedDB.open('env_pending_media',1);req.onupgradeneeded=()=>req.result.createObjectStore('uploads');req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);});}
async function operation(mode,fn){const db=await database();return new Promise((resolve,reject)=>{const tx=db.transaction('uploads',mode),req=fn(tx.objectStore('uploads'));let result;req.onsuccess=()=>{result=req.result;};tx.oncomplete=()=>{db.close();resolve(result);};tx.onerror=()=>{db.close();reject(tx.error);};});}
export function savePendingMedia(id,path,file,preset){return operation('readwrite',store=>store.put({id,path,file,preset,at:Date.now()},`${id}:${path}`));}
export function deletePendingMedia(id,path){return operation('readwrite',store=>store.delete(`${id}:${path}`));}
export async function listPendingMedia(id){return (await operation('readonly',store=>store.getAll())).filter(row=>row.id===id);}
