export default {
 async scheduled(controller,env,ctx) {
  const response=await fetch('https://enveely.pages.dev/api/internal/maintenance',{method:'POST',headers:{authorization:`Bearer ${env.MAINTENANCE_SECRET}`},redirect:'error',signal:AbortSignal.timeout(120_000)});
  if(!response.ok)throw new Error(`Maintenance failed: ${response.status}`);
  const result=await response.json();
  console.log(JSON.stringify({event:'maintenance_schedule',scheduledTime:controller.scheduledTime,...result}));
  if(result.failed)throw new Error('Payment reconciliation failed; inspect Pages activation logs.');
 },
 fetch(){return new Response('Not found',{status:404});},
};
