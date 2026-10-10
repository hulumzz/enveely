import {state} from '../state.js';
import { renderPage } from '../ui/app-shell.js';
import { analyticsEvents } from '../services/analytics.js';
import { templateFamilies } from '../data/templates.js';
import { invitationFrame, hydrateInvitationFrames } from '../ui/invitation-frame.js';
import { getFamilyPriceRange, formatRupiah, templatePlans } from '../data/plans.js';
import { icon } from '../core/icons.js';
import '../../styles/landing-editorial.css';

const selection = [
  ['mayura', 'mayura-pearl', 'Mayura Pearl', 'Merak dan ornamen taman dalam warna putih mutiara.'],
  ['amora', 'amora-garden', 'Amora Garden', 'Bingkai bunga dengan warna hijau dan kertas gading.'],
  ['pusaka', 'pusaka-kencana', 'Pusaka Kencana', 'Ukiran, batik, dan wayang dalam warna emas.'],
  ['elysian', 'elysian-ivory', 'Elysian Ivory', 'Susunan editorial dengan tipografi besar dan detail segel.'],
];

export function renderLanding() {
  analyticsEvents.landingView();
  renderPage(`<div class="landing-editorial">
    <section class="hero" aria-labelledby="landing-title">
      <div class="container hero__inner">
        <div class="hero__copy">
          <h1 id="landing-title">Undangan pernikahan,<br><em>pilihan kalian.</em></h1>
          <p>Pilih desain, isi detail acara, dan bagikan undangan lewat satu tautan. Foto, lokasi, dan konfirmasi tamu ada di dalamnya.</p>
          <div class="hero__cta"><a href="/templates" data-link class="btn btn--primary btn--lg">Pilih desain ${icon('arrowRight',{size:18})}</a><a href="/templates/mayura/preview/mayura-pearl" data-link class="hero__preview">Buka Mayura Pearl</a></div>
          <p class="hero__note">Ada pilihan gratis untuk 7 hari. Desain berbayar mulai Rp55.000.</p>
        </div>
        <div class="hero__collage" role="img" aria-label="Mayura Pearl di ponsel, dengan Amora Garden, Elysian Ivory, dan Pusaka Kencana di belakang">
          <div class="hero__sheet hero__sheet--one" data-assemble="back-one">${invitationFrame({templateId:'amora',variantId:'amora-garden',frame:'editorial'})}</div>
          <div class="hero__sheet hero__sheet--two" data-assemble="back-two">${invitationFrame({templateId:'elysian',variantId:'elysian-ivory',frame:'editorial'})}</div>
          <div class="hero__sheet hero__sheet--three" data-assemble="back-three">${invitationFrame({templateId:'pusaka',variantId:'pusaka-kencana',frame:'editorial'})}</div>
          <figure class="hero__keepsake" data-assemble="photo"><div class="hero__keepsake-mat"><img src="/demo/ring-hand.webp" alt="Detail cincin dan busana pengantin" width="240" height="280" fetchpriority="high"></div><figcaption>Raka &amp; Alya <span>07.11.2026</span></figcaption></figure>
          <div class="hero__phone" data-assemble="phone">${invitationFrame({templateId:'mayura',variantId:'mayura-pearl',frame:'phone'})}</div>
        </div>
      </div>
    </section>
    <section id="why-us" class="design-story container" aria-labelledby="design-title">
      <div class="design-story__visual assemble-group">
        <figure class="design-story__portrait assemble-item"><img src="/demo/sunda.webp" alt="Pasangan pengantin dalam busana Sunda" width="580" height="720" loading="lazy"><figcaption>Foto kalian, dalam desain yang kalian pilih.</figcaption></figure>
        <div class="design-story__invitation assemble-item">${invitationFrame({templateId:'mayura',variantId:'mayura-pearl',frame:'editorial',section:'couple'})}</div>
      </div>
      <div class="design-story__copy assemble-item"><h2 id="design-title">Lihat undangannya.<br><em>Baru tentukan.</em></h2><p>Buka contoh lengkap sebelum memilih. Setiap desain punya susunan foto, ornamen, dan tata letak sendiri.</p><p>Di editor, kalian bisa mengisi nama, menambahkan acara, dan memilih bagian yang ingin ditampilkan. Pratinjau mengikuti perubahan kalian.</p><a href="/templates" data-link class="text-link">Lihat semua desain ${icon('arrowRight',{size:18})}</a></div>
    </section>
    <section id="product" class="selected-designs container" aria-labelledby="collection-title">
      <header class="section-heading assemble-item"><h2 id="collection-title">Dari koleksi Enveely.</h2><a href="/templates" data-link class="text-link">${templateFamilies.length} koleksi ${icon('arrowRight',{size:18})}</a></header>
      <div class="selected-designs__grid assemble-group">${selection.map(([id,variant,name,desc],i)=>`<article class="selected-design assemble-item" style="--piece:${i}"><a class="selected-design__art" href="/templates/${id}/preview/${variant}" data-link aria-label="Buka contoh ${name}">${invitationFrame({templateId:id,variantId:variant,frame:'editorial'})}</a><div class="selected-design__caption"><h3>${name}</h3><p>${desc}</p><a href="/templates/${id}" data-link class="text-link">Mulai ${formatRupiah(getFamilyPriceRange(id).min)} ${icon('arrowRight',{size:16})}</a></div></article>`).join('')}</div>
    </section>
    <section class="invitation-details" aria-labelledby="details-title"><div class="container invitation-details__inner">
      <div class="invitation-details__intro assemble-item"><h2 id="details-title">Satu tautan.<br><em>Semua detail acara.</em></h2><p>Tamu bisa melihat jadwal, membuka petunjuk arah, dan mengirim konfirmasi kehadiran dari undangan yang sama.</p></div>
      <div class="invitation-details__list assemble-group">${[
        ['Acara dan lokasi','Tambahkan akad, resepsi, dan acara lain beserta waktu dan tautan peta.'],
        ['Foto dan cerita','Susun foto serta cerita kalian. Jumlah foto mengikuti paket desain.'],
        ['Konfirmasi tamu','Lihat kehadiran dan jumlah tamu dari dashboard.'],
        ['Ucapan','Periksa ucapan yang masuk sebelum menampilkannya di undangan.'],
      ].map(([title,desc],i)=>`<article class="assemble-item" style="--piece:${i}"><span aria-hidden="true">0${i+1}</span><div><h3>${title}</h3><p>${desc}</p></div></article>`).join('')}</div>
    </div></section>
    <section class="landing-pricing container assemble-group" aria-labelledby="pricing-title"><div class="assemble-item"><h2 id="pricing-title">Harga dan masa tayang.</h2><p>Desain gratis aktif 7 hari sejak publikasi pertama. Paket berbayar aktif setelah pembayaran disetujui.</p></div><div class="landing-pricing__options assemble-item"><article><h3>Serena Paper</h3><strong>Gratis</strong><p>7 hari tayang, editor, foto, dan RSVP.</p><a href="/create?template=serena&variant=serena-paper" data-link class="text-link">Buat undangan gratis ${icon('arrowRight',{size:16})}</a></article><article><h3>Desain berbayar</h3><strong>Rp55.000 <small>sampai Rp220.000</small></strong><p>3 bulan tayang. Pilihan 6 bulan dengan tambahan Rp15.000. ${Object.keys(templatePlans).length-1} variasi berbayar.</p><a href="/templates" data-link class="text-link">Bandingkan desain ${icon('arrowRight',{size:16})}</a></article></div></section>
    <section id="how-it-works" class="landing-steps container" aria-labelledby="steps-title"><h2 id="steps-title" class="assemble-item">Siapkan undangan kalian.</h2><ol class="assemble-group">${[['Pilih desain','Lihat contoh lengkap dan pilih variannya.'],['Isi detail','Tambahkan nama, foto, waktu, dan lokasi acara.'],['Periksa dan aktifkan','Cek pratinjau. Untuk desain berbayar, kirim bukti pembayaran dan tunggu review.'],['Bagikan tautan','Publikasikan undangan, lalu kirim ke tamu.']].map(([title,desc])=>`<li class="assemble-item"><h3>${title}</h3><p>${desc}</p></li>`).join('')}</ol></section>
    <section class="landing-closing"><div class="container assemble-item"><h2>Sudah menemukan<br><em>desain kalian?</em></h2><a href="/templates" data-link class="btn btn--primary btn--lg">Pilih undangan ${icon('arrowRight',{size:18})}</a></div></section>
  </div>`,root=>{ translateLanding(root); hydrateInvitationFrames(root); setupAssembly(root); });
}

function setupAssembly(root) {
  const preference=matchMedia('(prefers-reduced-motion: reduce)');
  const hero=root.querySelector('.hero__collage');
  const pieces=[...root.querySelectorAll('.assemble-item')];
  let raf=0;
  const visible=new Set();
  const observer=typeof IntersectionObserver==='function' ? new IntersectionObserver(entries=>entries.forEach(({target,isIntersecting})=>{ target.classList.toggle('is-assembling',isIntersecting);if(isIntersecting) visible.add(target); else visible.delete(target); schedule(); }),{rootMargin:'80px'}) : null;
  const paint=()=>{
    raf=0;
    if(preference.matches) { root.classList.remove('has-assembly'); return; }
    const height=window.innerHeight;
    const progress=hero ? Math.max(0,Math.min(1,1-hero.getBoundingClientRect().bottom/(height+hero.clientHeight))) : 0;
    hero?.style.setProperty('--hero-progress',progress.toFixed(3));
    for(const el of visible) {
      const box=el.getBoundingClientRect();
      const progress=Math.max(0,Math.min(1,(height*.95-box.top)/(height*.44)));
      el.style.setProperty('--assembly',progress.toFixed(3));
    }
  };
  const schedule=()=>{if(!raf) raf=requestAnimationFrame(paint);};
  if(observer && !preference.matches) {root.classList.add('has-assembly');pieces.forEach(el=>observer.observe(el));}
  const change=()=>{root.classList.toggle('has-assembly',!preference.matches && !!observer);schedule();};
  window.addEventListener('scroll',schedule,{passive:true}); window.addEventListener('resize',schedule,{passive:true});preference.addEventListener('change',change);schedule();
  document.addEventListener('env:navigate',()=>{observer?.disconnect();cancelAnimationFrame(raf);window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule);preference.removeEventListener('change',change);},{once:true});
}

const english={
 'Undangan pernikahan,':'A wedding invitation,','pilihan kalian.':'chosen by you.',
 'Pilih desain, isi detail acara, dan bagikan undangan lewat satu tautan. Foto, lokasi, dan konfirmasi tamu ada di dalamnya.':'Choose a design, add your event details, and share one link. Your photos, locations, and guest responses are all inside.',
 'Pilih desain':'Choose a design','Buka Mayura Pearl':'Open Mayura Pearl','Ada pilihan gratis untuk 7 hari. Desain berbayar mulai Rp55.000.':'A free design for 7 days. Paid designs from Rp55,000.',
 'Foto kalian, dalam desain yang kalian pilih.':'Your photos in the design you choose.','Lihat undangannya.':'See the invitation.','Baru tentukan.':'Then choose.',
 'Buka contoh lengkap sebelum memilih. Setiap desain punya susunan foto, ornamen, dan tata letak sendiri.':'Open a complete sample before choosing. Each design has its own photo composition, ornaments, and layout.',
 'Di editor, kalian bisa mengisi nama, menambahkan acara, dan memilih bagian yang ingin ditampilkan. Pratinjau mengikuti perubahan kalian.':'Add your names and events in the editor, and choose which sections to show. The preview updates as you edit.',
 'Lihat semua desain':'See every design','Dari koleksi Enveely.':'From the Enveely collection.',
 'Merak dan ornamen taman dalam warna putih mutiara.':'Peacocks and garden ornaments in pearl white.','Bingkai bunga dengan warna hijau dan kertas gading.':'Floral frames with green accents and ivory paper.','Ukiran, batik, dan wayang dalam warna emas.':'Carvings, batik, and wayang in gold.','Susunan editorial dengan tipografi besar dan detail segel.':'An editorial layout with large type and seal details.',
 'Satu tautan.':'One link.','Semua detail acara.':'Every event detail.','Tamu bisa melihat jadwal, membuka petunjuk arah, dan mengirim konfirmasi kehadiran dari undangan yang sama.':'Guests can check the schedule, get directions, and confirm attendance in the same invitation.',
 'Acara dan lokasi':'Events and locations','Tambahkan akad, resepsi, dan acara lain beserta waktu dan tautan peta.':'Add your ceremony, reception, and other events with times and map links.',
 'Foto dan cerita':'Photos and stories','Susun foto serta cerita kalian. Jumlah foto mengikuti paket desain.':'Arrange your photos and stories. The photo allowance depends on the design package.',
 'Konfirmasi tamu':'Guest responses','Lihat kehadiran dan jumlah tamu dari dashboard.':'See attendance and guest counts in your dashboard.',
 'Ucapan':'Messages','Periksa ucapan yang masuk sebelum menampilkannya di undangan.':'Review guest messages before showing them in the invitation.',
 'Harga dan masa tayang.':'Pricing and duration.','Desain gratis aktif 7 hari sejak publikasi pertama. Paket berbayar aktif setelah pembayaran disetujui.':'The free design lasts 7 days from first publication. Paid packages start when payment is approved.',
 'Gratis':'Free','7 hari tayang, editor, foto, dan RSVP.':'7 days, editor, photos, and RSVP.','Buat undangan gratis':'Create a free invitation','Desain berbayar':'Paid designs','sampai Rp220.000':'to Rp220,000','Bandingkan desain':'Compare designs',
 'Siapkan undangan kalian.':'Prepare your invitation.','Lihat contoh lengkap dan pilih variannya.':'View a full sample and choose a variant.',
 'Isi detail':'Add the details','Tambahkan nama, foto, waktu, dan lokasi acara.':'Add your names, photos, times, and event locations.',
 'Periksa dan aktifkan':'Review and activate','Cek pratinjau. Untuk desain berbayar, kirim bukti pembayaran dan tunggu review.':'Check the preview. For paid designs, submit payment proof and wait for review.',
 'Bagikan tautan':'Share the link','Publikasikan undangan, lalu kirim ke tamu.':'Publish the invitation, then send it to your guests.',
 'Sudah menemukan':'Have you found','desain kalian?':'your design?','Pilih undangan':'Choose your invitation',
};
function translateLanding(root){
 const nodes=[],walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);while(walker.nextNode())if(walker.currentNode.textContent.trim())nodes.push(walker.currentNode);
 nodes.forEach(node=>{const original=node.textContent;const text=original.trim();node._enveelyOriginal=original;node._enveelyEnglish=english[text] || (/^\d+ koleksi$/.test(text)?text.replace('koleksi','collections'):text.startsWith('Mulai Rp')?text.replace('Mulai','From'):text.startsWith('3 bulan tayang.')?`3 months. Choose 6 months for an additional Rp15,000. ${Object.keys(templatePlans).length-1} paid variants.`:null);});
 const apply=()=>nodes.forEach(node=>{node.textContent=state.app.locale==='en' && node._enveelyEnglish ? node._enveelyEnglish : node._enveelyOriginal;});apply();document.addEventListener('env:locale-changed',apply);document.addEventListener('env:navigate',()=>document.removeEventListener('env:locale-changed',apply),{once:true});
}
