const loaders={
 amora:()=>import('../../styles/amora.css'),nusantara:()=>import('../../styles/nusantara.css'),lumiere:()=>import('../../styles/lumiere.css'),elysian:()=>import('../../styles/elysian.css'),pusaka:()=>import('../../styles/pusaka.css'),mayura:()=>import('../../styles/mayura.css'),blocka:()=>import('../../styles/blocka.css'),meadow:()=>import('../../styles/meadow.css'),serena:()=>import('../../styles/serena.css'),
};
const fontFamilies={amora:'Manrope:wght@400;500;600;700&family=DM+Serif+Display',mayura:'Manrope:wght@400;500;600;700&family=DM+Serif+Display',pusaka:'Manrope:wght@400;500;600;700&family=Great+Vibes',nusantara:'Manrope:wght@400;500;600;700&family=Cinzel:wght@400;600;700',meadow:'Manrope:wght@400;500;600;700&family=Caveat:wght@500;600',elysian:'Inter:wght@400;500;600;700&family=DM+Serif+Display',lumiere:'Manrope:wght@400;500;600;700&family=DM+Serif+Display',serena:'Inter:wght@400;500;600;700',blocka:'Manrope:wght@400;500;600;700&family=DM+Serif+Display'};
const loaded=new Map();
export function loadDesignAssets(id){
 if(loaded.has(id))return loaded.get(id);
 const task=Promise.all([import('../../styles/atelier.css'),loaders[id]?.()]).then(()=>{
  if(fontFamilies[id]){const link=document.createElement('link');link.rel='stylesheet';link.href=`https://fonts.googleapis.com/css2?family=${fontFamilies[id]}&display=swap`;document.head.appendChild(link);}
 }).catch(error=>{loaded.delete(id);throw error;});loaded.set(id,task);return task;
}
