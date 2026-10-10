import {json} from '../_lib/firebase-admin.js';
import {publicReview} from '../_lib/reviews.js';
export async function onRequestGet({env}) {
 try{if(!env.PAYMENTS_DB)return json({reviews:[]});const rows=await env.PAYMENTS_DB.prepare("SELECT id,display_name,rating,message FROM customer_reviews WHERE status='approved' AND public_consent=1 ORDER BY reviewed_at DESC,id DESC LIMIT 12").all();const response=json({reviews:rows.results.map(publicReview)});response.headers.set('cache-control','public,max-age=60');return response;}
 catch{return json({reviews:[]},503);}
}
