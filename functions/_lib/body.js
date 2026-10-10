export async function boundedJson(request,max=16384) {
 const reader=request.body?.getReader();if(!reader)throw new Error('Body diperlukan.');
 let length=0;const chunks=[];
 for(;;){const {value,done}=await reader.read();if(done)break;length+=value.length;if(length>max){await reader.cancel();throw new Error('Body terlalu besar.');}chunks.push(value);}
 const result=new Uint8Array(length);let offset=0;for(const chunk of chunks){result.set(chunk,offset);offset+=chunk.length;}
 return JSON.parse(new TextDecoder().decode(result));
}
