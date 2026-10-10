import fs from 'node:fs';
import {templateFamilies} from '../src/data/templates.js';
const paths=['/','/templates','/help','/privacy','/terms',...templateFamilies.map(f=>`/templates/${f.id}`)];
fs.writeFileSync('public/sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map(path=>`<url><loc>https://enveely.pages.dev${path}</loc></url>`).join('')}</urlset>\n`);
