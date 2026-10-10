import fs from 'node:fs';
import {createHash} from 'node:crypto';
const rules=fs.readFileSync('firestore.rules','utf8'),indexes=JSON.parse(fs.readFileSync('firestore.indexes.json','utf8'));
fs.writeFileSync('functions/_lib/deployment-policy.js',`// Generated from tracked rules and indexes by build-policy.mjs.\nexport const policy=${JSON.stringify({rules,indexes,hash:createHash('sha256').update(rules).digest('hex')})};\n`);
