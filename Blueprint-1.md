# ULWED — Product & Technical Blueprint

**Document status:** Master Blueprint / Source of Truth  
**Product:** ULWED  
**Version:** 1.0  
**Date:** 2026-08-24  
**Primary languages:** Indonesia (ID), English (EN)  
**Initial distribution:** Web app  
**Initial implementation:** HTML + CSS + JavaScript + Firebase

---

## 0. Executive Summary

ULWED adalah platform pembuat undangan pernikahan digital yang memungkinkan **pasangan, Wedding Organizer (WO), dan Event Organizer (EO)** memilih template undangan lengkap, mengganti konten secara mudah, mengganti foto langsung dari gallery, mengatur beberapa acara, lalu membagikan undangan melalui URL atau WhatsApp.

Nilai utama ULWED bukan sekadar mengganti warna pada satu layout. Setiap template harus memiliki **Design DNA** yang berbeda: komposisi layout, tipografi, kepadatan foto, frame, ornament, dekorasi, divider, background treatment, image treatment, dan animasi. Template juga memiliki variasi visual sehingga dua undangan dari template family yang sama tetap dapat memiliki karakter berbeda.

MVP dimulai sebagai web app tanpa login. Data persisten menggunakan Firebase. Editor harus terasa seperti aplikasi visual sederhana, bukan form konfigurasi yang rumit. User memilih desain, mengisi konten, melakukan preview, lalu menghasilkan invitation yang dapat dibagikan.

---

# 1. Product Identity

## 1.1 Nama Produk

**ULWED**

## 1.2 Tagline

**“Your Story, Beautifully Invited.”**

Alternatif Bahasa Indonesia:

**“Cerita Cinta Kalian, Dalam Undangan yang Berkesan.”**

Primary tagline untuk UI/branding awal: **Your Story, Beautifully Invited.**

## 1.3 Product Positioning

> ULWED adalah wedding invitation builder yang mengutamakan **design-first customization**: pengguna tidak hanya memilih warna, tetapi memilih identitas visual undangan yang lengkap.

## 1.4 Target Pengguna

### Primary
- Pasangan yang ingin membuat undangan sendiri.
- WO yang membutuhkan alat pembuatan undangan cepat untuk klien.
- EO yang mengelola beberapa event/wedding.

### Secondary
- Freelancer desain undangan.
- Wedding planner.
- Keluarga yang membantu menyiapkan acara.

---

# 2. Product Principles

1. **Design First** — template harus terlihat berbeda secara nyata, bukan hanya warna.
2. **Easy Editing** — pengguna tidak harus memahami CSS atau desain.
3. **Photo Friendly** — foto dapat diganti melalui gallery/file picker tanpa mengubah layout.
4. **Content ≠ Design** — data acara dan desain disimpan terpisah.
5. **Template as a System** — template terdiri dari section, layout, ornament, typography, dan design tokens.
6. **Mobile First** — undangan paling banyak dikonsumsi melalui smartphone.
7. **Progressive Complexity** — pengguna pemula melihat kontrol sederhana; kontrol detail dapat muncul saat dibutuhkan.
8. **No Login Friction for MVP** — pembuatan awal tidak meminta sign-in.
9. **Share First** — hasil akhir harus mudah dibagikan lewat WhatsApp dan URL.
10. **Backend Ready** — arsitektur awal harus mudah dikembangkan ke custom URL, dashboard client, analytics, dan backend yang lebih kuat.

---

# 3. Scope

## 3.1 MVP

### Marketing / Landing
- Hero.
- Template showcase.
- Feature showcase.
- How it works.
- Template preview.
- CTA create invitation.
- Language switch ID/EN.

### Invitation Builder
- Pilih template.
- Pilih variation.
- Edit teks.
- Upload/ganti foto.
- Reorder section.
- Hide/show section.
- Duplikasi section bila didukung template.
- Edit event details.
- Countdown.
- Gallery.
- Multiple events.
- Maps.
- RSVP.
- Background music.
- Share URL.
- Share WhatsApp.
- Mobile/desktop preview.
- Autosave.
- Draft / publish state.

### Firebase
- Firebase App initialization.
- Cloud Firestore.
- Cloud Storage untuk asset user.
- Firebase Analytics.
- Firebase Hosting.
- Security Rules.
- App Check dipersiapkan untuk tahap hardening.

## 3.2 Later / Phase 2+
- Firebase Authentication.
- Custom URL/domain.
- Guest name personalization.
- RSVP dashboard.
- Guest management.
- Analytics invitation.
- Multiple collaborators.
- Admin template management.
- Template marketplace.
- Premium templates.
- Advanced editor.
- Cloud Functions / Cloud Run untuk server-side workflows.
- QR code.
- Bulk invitation.
- Export/print.

---

# 4. Technology Stack

## 4.1 Frontend

- **HTML5** — semantic structure.
- **CSS3** — styling, responsive layout, animations, design tokens.
- **Vanilla JavaScript (ES modules)** — application logic.
- No framework required for the initial build.

Recommended module approach:

```text
ES Modules
├── app.js
├── router.js
├── state.js
├── renderer.js
├── template-engine.js
├── storage.js
├── firebase.js
└── components/
```

## 4.2 Firebase

Project provided by user:

```text
Project ID: ulwed-d729f
Auth Domain: ulwed-d729f.firebaseapp.com
Storage Bucket: ulwed-d729f.firebasestorage.app
```

The supplied web configuration uses:

- Firebase App.
- Firebase Analytics.

Planned Firebase modules:

- `firebase/app`
- `firebase/analytics`
- `firebase/firestore`
- `firebase/storage`
- Optional later: `firebase/app-check`
- Optional later: `firebase/auth`

Firebase Hosting is appropriate for the static HTML/CSS/JS app and supports custom domains and SSL. https://firebase.google.com/docs/hosting/quickstart

Cloud Storage for Firebase is intended for user-generated media such as images and video. Current Firebase documentation states that Cloud Storage for Firebase requires the Blaze plan, so storage usage/cost should be treated as part of the deployment checklist. https://firebase.google.com/docs/storage/web/start

## 4.3 No frontend framework in MVP

Vue/React/Angular tidak diperlukan pada tahap pertama. Vanilla JS dipilih untuk:

- dependency minimal;
- kontrol penuh terhadap renderer template;
- mudah dipelajari dan dipelihara untuk MVP;
- cocok untuk halaman marketing dan invitation renderer.

Framework dapat dipertimbangkan bila editor menjadi sangat kompleks.

---

# 5. High-Level Architecture

```text
                         ULWED WEB APP
                              │
          ┌───────────────────┼───────────────────┐
          │                   │                   │
       Landing            Builder             Published
          │                   │                Invitation
          │                   │                   │
          └──────────────┬────┴──────────────┬────┘
                         │                   │
                    App State           Public Data
                         │                   │
                         └──────────┬────────┘
                                    │
                         Firebase Client SDK
                                    │
               ┌────────────────────┼────────────────────┐
               │                    │                    │
          Firestore             Storage             Analytics
               │                    │                    │
         invitation data        user media        product metrics
                                    │
                              Firebase Hosting
```

---

# 6. Core Architectural Rule: Content vs Design

Ini adalah keputusan arsitektur paling penting.

## 6.1 Content Data

Content menjawab **apa yang ditampilkan**.

Contoh:

```js
{
  groomName: "Raka",
  brideName: "Alya",
  weddingDate: "2026-12-20",
  events: [...],
  story: [...],
  gallery: [...]
}
```

## 6.2 Design Data

Design menjawab **bagaimana cara menampilkannya**.

```js
{
  templateId: "amora",
  variationId: "garden",
  typography: {...},
  colors: {...},
  ornaments: {...},
  layouts: {...},
  motion: {...}
}
```

## 6.3 Benefit

User dapat mengganti template tanpa kehilangan:

- nama;
- tanggal;
- event;
- foto;
- story;
- RSVP settings;
- map/location;
- gift information.

---

# 7. Invitation Lifecycle

```text
New Invitation
      │
      ▼
Choose Template
      │
      ▼
Choose Variation
      │
      ▼
Enter Basic Wedding Info
      │
      ▼
Open Builder
      │
      ▼
Edit Content + Design
      │
      ├── autosave draft
      │
      ▼
Preview
      │
      ▼
Publish
      │
      ▼
Share URL / WhatsApp
```

States:

```text
DRAFT
  ↓
READY
  ↓
PUBLISHED
  ↓
ARCHIVED
```

---

# 8. No-Login MVP Identity Strategy

User tidak perlu login pada MVP. Karena data cloud membutuhkan cara untuk menghubungkan beberapa write/read dari browser yang sama, aplikasi menggunakan **local installation identifier** pada browser.

Contoh:

```text
ulwed_device_id = ULWED-<random-id>
```

Identifier ini:

- dibuat satu kali;
- disimpan di `localStorage`;
- tidak dianggap sebagai user identity yang aman;
- digunakan untuk pengalaman draft/session pada MVP.

### Important security limitation

Anonymous client access bukan pengganti authorization. Firebase sendiri menyarankan Authentication + Firestore Security Rules untuk mengamankan akses client; Firebase juga menyediakan App Check untuk membantu memastikan request berasal dari aplikasi yang diharapkan. Jangan menerapkan rules `allow read, write: if true` pada production karena dapat membuat seluruh database terbuka untuk manipulasi. https://firebase.google.com/docs/firestore/security/overview https://firebase.google.com/docs/firestore/security/insecure-rules

Karena ULWED tidak menggunakan login pada MVP, data yang **sensitif atau membutuhkan ownership kuat** sebaiknya belum disediakan atau dibatasi dengan mekanisme server-side pada fase berikutnya.

---

# 9. Firestore Data Model

Recommended top-level collections:

```text
/templates/{templateId}
/templateVariants/{variantId}
/invitations/{invitationId}
/invitations/{invitationId}/rsvps/{rsvpId}
/invitations/{invitationId}/wishes/{wishId}
/invitations/{invitationId}/guests/{guestId}
/analytics/{eventId}
```

Untuk MVP, template dapat disimpan di source code terlebih dahulu agar tidak membutuhkan admin CMS. Firestore digunakan untuk invitation data dan guest-generated data. Setelah template builder/admin tersedia, template dipindahkan ke Firestore.

## 9.1 Invitation Document

Contoh konseptual:

```js
{
  id: "inv_abc123",
  status: "draft",
  slug: null,
  locale: "id",

  deviceId: "ULWED-abc",

  couple: {
    groom: {
      name: "Raka",
      nickname: "Raka",
      photoUrl: ""
    },
    bride: {
      name: "Alya",
      nickname: "Alya",
      photoUrl: ""
    }
  },

  design: {
    templateId: "amora",
    variantId: "garden",
    customizations: {}
  },

  sections: [
    {
      id: "cover",
      type: "cover",
      enabled: true,
      order: 0,
      config: {}
    }
  ],

  events: [],
  story: [],
  gallery: [],
  location: {},
  music: {},
  rsvpSettings: {},
  giftSettings: {},

  createdAt: null,
  updatedAt: null,
  publishedAt: null
}
```

## 9.2 RSVP Document

```js
{
  name: "Budi",
  attendance: "attending",
  guestCount: 2,
  message: "Selamat ya!",
  createdAt: null
}
```

RSVP write validation harus dibatasi pada field yang diizinkan, ukuran string, jumlah guest, dan invitation state. Jangan memberikan client akses write generik ke seluruh document invitation.

## 9.3 Wishes Document

```js
{
  name: "Sinta",
  message: "Semoga menjadi keluarga sakinah...",
  approved: false,
  createdAt: null
}
```

Approval flow dapat ditambahkan nanti.

---

# 10. Firestore Security Strategy

Rules harus mengikuti prinsip **least privilege**.

### Public invitation
- Read: boleh untuk invitation yang `status == published`.
- Draft: tidak boleh dibaca publik.
- Update invitation: tidak boleh dilakukan secara bebas dari public client.

### RSVP
- Public create: hanya field tertentu.
- Public read: opsional; default disarankan tidak membuka seluruh RSVP.
- Owner read: membutuhkan ownership mechanism pada fase berikutnya.

### Wishes
- Public create: boleh dengan validation.
- Public read: hanya jika invitation mengaktifkan guest wishes.

### Templates
- Public read: boleh.
- Public write: jangan.

### Asset metadata
- Public read: hanya asset yang terkait published invitation jika diperlukan.
- Upload/delete: batasi dengan rules dan/atau server-side workflow.

Gunakan Firestore Emulator + Rules unit tests sebelum deployment production. Firebase menyediakan Rules Playground dan emulator untuk menguji security rules. https://firebase.google.com/docs/firestore/security/insecure-rules

---

# 11. Asset Architecture

Cloud Storage menjadi tempat media, bukan Firestore.

Recommended path:

```text
invitations/
  {invitationId}/
    gallery/
      original/
      optimized/
    couple/
    cover/
    music/
    video/
```

Firestore hanya menyimpan:

```text
storagePath
public/download URL or resolved URL
alt text
width
height
mimeType
size
position/order
```

Cloud Storage cocok untuk image/video user-generated content. https://firebase.google.com/docs/storage/web/start

---

# 12. Image Replacement Mechanism

UX wajib mengikuti prinsip:

> **User mengganti slot foto, bukan mendesain ulang layout.**

Misalnya template memiliki:

```text
Hero Photo Slot
Couple Photo Slot
Gallery Slot 01
Gallery Slot 02
Gallery Slot 03
```

Saat user memilih `Change Photo`:

```text
Open Gallery / File Picker
        ↓
Select Image
        ↓
Preview Crop
        ↓
Optional Position
        ↓
Replace Slot
        ↓
Save
```

Editor tidak boleh memaksa user memahami CSS `object-position`, ukuran piksel, atau aspect ratio.

### Recommended image behavior

- `object-fit: cover` sebagai default.
- Aspect ratio ditentukan template.
- Crop editor optional.
- Replace mempertahankan slot/layout.
- Lazy loading untuk gallery.
- Kompresi/resize perlu dipertimbangkan sebelum upload besar.

---

# 13. Template Engine

Template renderer menerima configuration + content.

```text
Invitation JSON
      +
Template Definition
      +
Variant Definition
      ↓
Renderer
      ↓
Section Components
      ↓
HTML DOM
```

Template definition:

```js
{
  id: "amora",
  family: "romantic-floral",
  name: "Amora",
  tags: ["romantic", "floral", "elegant"],
  typography: {...},
  colors: {...},
  ornaments: [...],
  sectionLayouts: {...},
  supportedSections: [...]
}
```

Variant:

```js
{
  id: "amora-garden",
  parentTemplate: "amora",
  density: "medium",
  imageStrategy: "balanced",
  layoutStrategy: "garden",
  ornamentSet: "floral-03",
  frameSet: "organic-01",
  typography: {...},
  colors: {...}
}
```

---

# 14. Template Differentiation Rule

Template baru **tidak boleh** dianggap unik jika hanya mengganti warna.

Minimal 4–6 aspek berikut harus berbeda secara visual:

- Overall composition.
- Hero composition.
- Typography pairing.
- Ornament family.
- Frame/border style.
- Section layout.
- Image treatment.
- Image density.
- Background texture/pattern.
- Divider style.
- Button/shape language.
- Animation behavior.

### Image density tiers

```text
LOW
- 1–4 prominent photos
- Fokus typography/story

MEDIUM
- 5–9 photos
- Balanced text + imagery

HIGH
- 10–20+ photos
- Gallery-driven
- Editorial / scrapbook feeling
```

Setiap family memiliki setidaknya 2–3 variation density yang berbeda.

---

# 15. Section Component System

Core sections:

```text
Cover
Welcome
Couple
Parents
Event
Countdown
Story
Gallery
Video
Map
GPS / Route
RSVP
Gift
Wishes
Music
Closing
```

Not every template harus memakai semua section secara default.

Template menentukan:

```text
supported
recommended
optional
locked
```

---

# 16. Multiple Event Architecture

Satu invitation dapat memiliki:

```text
Event 1 — Akad
Event 2 — Resepsi
Event 3 — After Party
```

Setiap event:

```js
{
  id: "event-1",
  type: "akad",
  title: "Akad Nikah",
  date: "2026-12-20",
  startTime: "08:00",
  endTime: "10:00",
  venue: "Masjid ...",
  address: "...",
  coordinates: {
    lat: 0,
    lng: 0
  },
  mapsUrl: ""
}
```

Template dapat menampilkan:

- stacked events;
- timeline;
- cards;
- split event layout;
- calendar layout.

---

# 17. Maps & GPS Tracker

## Maps

MVP menyediakan link/embedded map melalui provider yang disepakati saat implementasi.

Data lokasi disimpan sebagai:

```text
placeName
address
lat
lng
mapsUrl
```

## GPS / Route

Fitur GPS Tracker harus didefinisikan sebagai **fitur navigasi tamu**, bukan pelacakan pasangan/tamu secara diam-diam.

Contoh UX:

```text
[ Lihat Lokasi ]
[ Buka Navigasi ]
[ Bagikan Lokasi ]
```

Jika nanti ada fitur live location, harus:

- opt-in;
- jelas kapan aktif;
- jelas siapa yang dapat melihat;
- memiliki expiry;
- dapat dimatikan.

---

# 18. RSVP Strategy

RSVP dapat disimpan ke Firestore sebagai subcollection:

```text
invitations/{invitationId}/rsvps/{rsvpId}
```

Settings:

```js
{
  enabled: true,
  askAttendance: true,
  askGuestCount: true,
  askPhone: false,
  allowMessage: true,
  maxGuestCount: 5
}
```

MVP default:

- attendance;
- guest count;
- message.

---

# 19. WhatsApp Sharing

Share button should generate a prefilled message.

Example:

```text
Assalamu'alaikum.

Dengan penuh kebahagiaan, kami mengundang Anda untuk hadir di acara pernikahan Alya & Raka.

Lihat undangan:
https://...
```

The app should use the browser's native share API when available, with WhatsApp as a dedicated fallback/action.

---

# 20. URL Strategy

## MVP

Use a temporary or Firebase-hosted path, e.g.:

```text
https://<site>.web.app/invite/<invitationId>
```

Firebase Hosting supports SPA/static hosting, rewrites, redirects, and custom domains. https://firebase.google.com/docs/hosting/full-config

## Later

Custom slug:

```text
https://ulwed.com/aulia-raka
```

Future custom-domain support:

```text
https://auliaraka.com
```

Slug requirements:

- lowercase;
- URL-safe;
- unique;
- reserved words blocked;
- normalized;
- editable only under controlled ownership.

---

# 21. Localization ID / EN

UI language is controlled separately from invitation language.

```text
appLocale: "id" | "en"
invitationLocale: "id" | "en"
```

Example:

```text
Builder UI: Indonesia
Invitation output: English
```

All UI strings should live in a translation map:

```js
{
  id: {
    createInvitation: "Buat Undangan",
    preview: "Pratinjau"
  },
  en: {
    createInvitation: "Create Invitation",
    preview: "Preview"
  }
}
```

Do not hard-code repeated UI text into components.

---

# 22. App State

Recommended top-level state:

```js
{
  app: {
    locale: "id",
    route: "builder",
    isOnline: true
  },

  project: {
    invitationId: null,
    status: "draft",
    lastSavedAt: null
  },

  invitation: {},

  editor: {
    selectedSectionId: null,
    selectedElementId: null,
    previewMode: "mobile",
    dirty: false
  },

  ui: {
    modal: null,
    toast: null,
    sidebar: "sections"
  }
}
```

---

# 23. Autosave

Autosave should be debounced.

```text
User edits
   ↓
State changes
   ↓
Mark dirty
   ↓
Debounce
   ↓
Validate
   ↓
Persist
   ↓
Update lastSavedAt
```

Target behavior:

- local state updates immediately;
- localStorage draft is a fast safety layer;
- Firestore sync follows shortly after for cloud persistence;
- show `Saving...`, `Saved`, or `Offline` state.

Do not block typing while saving.

---

# 24. Offline / Weak Network Strategy

The app should remain usable while the user is temporarily offline.

At minimum:

- keep current state in memory;
- save a local draft;
- queue save intent;
- retry when network returns;
- show a non-blocking status.

Firestore on the web supports offline persistence when configured; implementation must explicitly decide and test the persistence behavior for this app. Use the official Firestore configuration and test browser/device edge cases before enabling it in production. 

---

# 25. Invitation Renderer

Renderer responsibilities:

1. Resolve template.
2. Resolve variant.
3. Resolve section order.
4. Bind content.
5. Apply design tokens.
6. Render ornaments.
7. Render image slots.
8. Attach interactions.
9. Apply responsive classes.
10. Apply animation settings.

Renderer should not directly mutate Firestore.

```text
Firestore → State → Renderer
```

not:

```text
Component → Firestore → DOM → Firestore → DOM
```

---

# 26. Editor UX Architecture

Three main areas:

```text
┌─────────────────────────────────────────────────────────┐
│ Top Bar: Logo | Save | Preview | Publish               │
├──────────────┬─────────────────────────────┬────────────┤
│ Section      │                             │ Properties │
│ Panel        │          Canvas             │ Panel      │
│              │                             │            │
│ Cover        │       Mobile Preview        │ Typography │
│ Couple       │                             │ Image      │
│ Event        │                             │ Layout     │
│ Gallery      │                             │ Ornament   │
│ RSVP         │                             │            │
└──────────────┴─────────────────────────────┴────────────┘
```

Mobile editor later:

```text
Top toolbar
      ↓
Canvas
      ↓
Bottom sheet controls
```

---

# 27. Folder Structure

Recommended:

```text
ulwed/
├── index.html
├── app.html
├── editor.html
├── preview.html
├── templates.html
├── dashboard.html
│
├── firebase.json
├── firestore.rules
├── firestore.indexes.json
├── storage.rules
│
├── assets/
│   ├── ornaments/
│   ├── patterns/
│   ├── frames/
│   ├── illustrations/
│   └── placeholders/
│
├── css/
│   ├── reset.css
│   ├── tokens.css
│   ├── global.css
│   ├── landing.css
│   ├── dashboard.css
│   ├── editor.css
│   ├── invitation.css
│   └── responsive.css
│
├── js/
│   ├── app.js
│   ├── router.js
│   ├── firebase.js
│   ├── state.js
│   ├── storage.js
│   ├── firestore.js
│   ├── renderer.js
│   ├── template-engine.js
│   ├── i18n.js
│   ├── share.js
│   ├── media.js
│   ├── utils.js
│   ├── components/
│   └── sections/
│
├── data/
│   ├── templates.js
│   ├── variants.js
│   ├── sections.js
│   ├── ornaments.js
│   └── translations.js
│
└── docs/
    ├── Blueprint.md
    └── Design.md
```

---

# 28. Core Components

```text
AppShell
Navbar
LanguageSwitcher
TemplateCard
TemplateGallery
TemplatePreview
InvitationSetup
BuilderShell
SectionNavigator
Canvas
PropertyPanel
TypographyControl
ColorControl
ImageSlot
ImagePicker
GalleryManager
EventManager
LocationPicker
CountdownPreview
MusicControl
RSVPForm
PublishModal
ShareModal
Toast
ConfirmModal
LoadingState
EmptyState
```

---

# 29. UX States

Every async action harus memiliki:

### Loading
```text
Uploading photo...
Saving invitation...
Loading invitation...
```

### Success
```text
Photo replaced.
Invitation saved.
Invitation published.
```

### Error
```text
Couldn't save your changes.
Please try again.
```

### Offline
```text
You're offline. Your latest changes are saved on this device.
```

---

# 30. Performance Rules

- Lazy-load below-the-fold images.
- Avoid rendering hidden sections unnecessarily.
- Optimize large uploaded images.
- Prefer CSS over heavy DOM effects.
- Use SVG for simple ornaments/icons.
- Avoid loading all high-resolution gallery assets at once.
- Keep template definitions data-driven.
- Use `content-visibility` or equivalent progressive rendering carefully where supported.

---

# 31. Accessibility

- Semantic HTML.
- Keyboard reachable controls.
- Visible focus state.
- Proper labels for forms.
- Alt text for meaningful images.
- Decorative ornaments marked appropriately.
- Sufficient contrast.
- Reduced-motion support using `prefers-reduced-motion`.
- No interaction dependent on hover only.
- Clear error messages.

---

# 32. Analytics

Firebase Analytics can track anonymous product events such as:

```text
landing_view
view_template
template_preview
create_invitation
editor_open
section_added
image_uploaded
image_replaced
preview_open
publish_invitation
share_whatsapp
share_url
rsvp_submitted
language_changed
```

Do not send sensitive wedding guest content as analytics event payload.

---

# 33. Privacy

Data categories:

### User-generated
- Names.
- Photos.
- Event location.
- RSVP.
- Wishes.
- Optional contact information.

These should be treated as private user content even though the invitation itself is designed to become public.

### Public invitation
Only data deliberately published by the invitation owner/creator should be publicly rendered.

### GPS
Any future live GPS feature must be opt-in, visible, temporary, and revocable.

---

# 34. Admin / Template Management Strategy

MVP:

- Templates stored in version-controlled JS/data files.
- Assets stored under `assets/`.
- No admin CMS required.

Phase 2:

```text
/admin
  ├── templates
  ├── variants
  ├── ornaments
  ├── sections
  └── asset-library
```

Admin writes must be authenticated and authorized.

---

# 35. Development Phases

## Phase 0 — Foundation

- Firebase project connection.
- Folder structure.
- Base design tokens.
- Routing.
- i18n.
- App shell.

## Phase 1 — Landing + Templates

- Landing page.
- Template gallery.
- Template preview.
- 6 template families.
- Template variants.

## Phase 2 — Builder Core

- Invitation creation.
- Content forms.
- Section navigator.
- Canvas.
- Property panel.
- Template engine.
- Image replacement.

## Phase 3 — Firebase

- Firestore persistence.
- Storage upload.
- Autosave.
- Draft/publish.
- Security Rules.
- Analytics.

## Phase 4 — Wedding Features

- Multiple events.
- Countdown.
- Maps.
- RSVP.
- Gallery.
- Music.
- Share WhatsApp.

## Phase 5 — Public Invitation

- Published URL.
- Responsive public invitation.
- Social sharing.
- Loading/404 states.

## Phase 6 — Hardening

- App Check.
- Rules tests.
- Storage Rules.
- Rate limiting strategy.
- abuse prevention.
- performance testing.

---

# 36. Security Checklist

Before production:

- [ ] Firestore rules do not use global `allow read, write: if true`.
- [ ] Template writes are restricted.
- [ ] Draft invitations are not publicly readable.
- [ ] RSVP writes are field-validated.
- [ ] File type validation is implemented.
- [ ] File size limits are implemented.
- [ ] Storage Rules are implemented.
- [ ] App Check is evaluated/enabled.
- [ ] Abuse/rate-limit strategy exists for public RSVP/wishes.
- [ ] Secrets/service-account keys are never shipped to browser.
- [ ] Firebase config is treated as client configuration, while privileged credentials remain server-side.

Firebase recommends Authentication + Security Rules for client-side access control and App Check as an additional layer. https://firebase.google.com/docs/firestore/security/overview

---

# 37. Acceptance Criteria for MVP

The MVP is considered functional when:

1. User opens ULWED without login.
2. User can browse templates.
3. User can preview a template.
4. User can create an invitation.
5. User can select a template + variation.
6. User can replace template photo slots from local gallery/file picker.
7. User can edit wedding content.
8. User can add multiple events.
9. User can configure countdown.
10. User can configure location/maps.
11. User can enable RSVP.
12. User can manage gallery.
13. User can add background music.
14. User can preview mobile and desktop.
15. Draft persists locally.
16. Cloud persistence works with Firestore when configured.
17. Images persist in Firebase Storage when configured.
18. User can publish an invitation.
19. Published invitation is accessible through a public URL.
20. User can share the invitation via WhatsApp.
21. User can switch app language ID/EN.
22. Different template variations produce materially different visual output.

---

# 38. Design DNA Governance

Every new template must document:

```text
Template ID
Family
Mood
Typography
Primary colors
Secondary colors
Background treatment
Ornament family
Frame family
Divider family
Image density
Hero layout
Section layout strategy
Photo treatment
Button style
Icon style
Motion style
Mobile adaptation
```

No template is considered complete until all of the above have been specified.

---

# 39. Firebase Notes Based on Supplied SDK

The supplied configuration currently initializes:

```js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
```

This is only the base initialization. Firestore and Storage will be added once the app data model and upload flow are ready.

Recommended initialization shape:

```js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const storage = getStorage(app);
```

Do not put service account credentials, Admin SDK private keys, or other privileged credentials into browser code.

---

# 40. Important Implementation Decision

ULWED should be implemented as a **data-driven design system**, not a collection of unrelated HTML pages.

The core loop is:

```text
CONTENT
  +
TEMPLATE DNA
  +
VARIANT DNA
  +
SECTION CONFIG
  ↓
RENDER ENGINE
  ↓
INVITATION
```

This makes it possible to add a new template without rewriting the entire editor.

---

# 41. Source References

- Firebase Hosting: https://firebase.google.com/docs/hosting/quickstart
- Firebase Hosting configuration: https://firebase.google.com/docs/hosting/full-config
- Firestore security overview: https://firebase.google.com/docs/firestore/security/overview
- Firestore insecure rules warning: https://firebase.google.com/docs/firestore/security/insecure-rules
- Cloud Storage for Firebase — Web: https://firebase.google.com/docs/storage/web/start
- Cloud Storage uploads: https://firebase.google.com/docs/storage/web/upload-files

---

# 42. Final Product North Star

**ULWED bukan generator undangan berbasis warna.**

ULWED adalah sistem desain undangan pernikahan digital berbasis template yang memungkinkan pengguna memperoleh hasil visual berbeda hanya dengan memilih design family, variation, dan konten mereka.

Target pengalaman:

> **Choose a feeling → choose a design → tell your story → share your invitation.**

## Image Hosting Decision — ImgBB

ULWED will **not use Firebase Cloud Storage for user-uploaded invitation images** in the current architecture.

### Selected image host

- Provider: **ImgBB**
- Purpose: user-uploaded wedding photos, gallery images, cover images, couple photos, decorative image replacements, and other invitation media.
- Firebase Storage: **disabled / not required for MVP**
- Firestore: stores image metadata and the resulting public image URL, not the binary image itself.

### Upload flow

```text
User selects image
      ↓
Client validates file
      ↓
Compress / resize when appropriate
      ↓
Upload to ImgBB API
      ↓
Receive hosted image URL
      ↓
Save URL + metadata in Firestore
      ↓
Render image in invitation
```

### Client-side upload rules

1. Validate file type before upload.
2. Validate maximum file size.
3. Show upload progress/loading state.
4. Generate a local preview immediately.
5. Upload asynchronously.
6. Save only the returned hosted URL and useful metadata to Firestore.
7. Allow the user to replace an image without rebuilding the section.
8. Keep the previous image URL until the replacement upload succeeds.
9. Handle failed uploads without losing the current invitation state.
10. Avoid storing raw image binaries in Firestore.

### Important security note

The ImgBB API key must **not be treated as a secret embedded in publicly distributed browser code**. Because the current ULWED architecture is browser-first and has no custom backend, an upload API key exposed to the browser should be treated as a client-side credential. Before public production, move image upload behind a server-side/proxy layer if the provider/account setup requires the key to remain private.

For development, keep the key in a local configuration/environment mechanism and never commit it to a public repository.

### Image metadata model

Recommended Firestore image record:

```js
{
  id: "image-id",
  invitationId: "invitation-id",
  role: "cover",
  url: "https://...",
  deleteUrl: null,
  width: 1600,
  height: 1067,
  mimeType: "image/jpeg",
  originalName: "IMG_1234.jpg",
  createdAt: timestamp
}
```

`deleteUrl` should only be stored/used if the chosen ImgBB API response provides a valid deletion mechanism and the application actually needs deletion support.

### Image replacement UX

Every image placeholder in the builder should support:

```text
[ Replace Photo ]

→ Upload from device
→ Select from uploaded gallery
→ Remove photo
→ Crop / focal point
→ Reset
```

The invitation template should never force the user to edit HTML/CSS to replace a photo.

### Photo density

Templates must support different photo-density profiles:

- **Low** — 1–4 prominent photos
- **Medium** — 5–10 photos
- **High** — 11+ photos / collage-heavy layouts

The same content model must work across all three profiles.

### Future migration

If ULWED later moves to Firebase Storage, the image abstraction should remain:

```text
ImageService
├── upload()
├── getUrl()
├── replace()
├── remove()
└── optimize()
```

Only the provider implementation changes; invitation content and template definitions should not need to change.

## Firebase Scope Clarification

ULWED currently uses Firebase primarily for **Firestore** and **Analytics**. Firebase Storage is intentionally not part of the MVP image pipeline.

Authentication is intentionally omitted from the MVP because the product does not require user login. This creates a special security requirement: public invitation viewing and anonymous editing/storage must be designed carefully rather than using unrestricted Firestore rules.

Firebase's documentation states that Firestore Security Rules control access from web clients and warns against production rules such as `allow read, write: if true`. Rules should be designed alongside the data model and tested before production. See the official Firebase documentation on [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/overview) and [insecure rules](https://firebase.google.com/docs/firestore/security/insecure-rules).

### No-login ownership strategy

For the no-login MVP, ULWED should not assume that a browser-generated identifier is equivalent to strong identity.

Recommended architecture:

```text
Browser
  ↓
Create invitation
  ↓
Generate opaque invitation/edit token
  ↓
Store invitation document
  ↓
Public invitation URL → public read model
  ↓
Editor URL/token → restricted edit capability
```

For stronger production security, add a backend/serverless endpoint later to mint and validate edit tokens rather than relying solely on client-side secrecy.

### Public vs editor data

Separate public invitation data from private editor/control data whenever practical:

```text
invitations/{invitationId}
  ├── public content
  ├── publication status
  ├── slug
  └── design configuration

invitationControl/{invitationId}
  ├── edit capability
  ├── owner token metadata
  └── internal control fields
```

Do not expose editor credentials/tokens through the public invitation document.

### Firestore query discipline

Firestore Security Rules are not filters; queries must be designed to satisfy the applicable rules. Therefore, every collection and query in ULWED should be designed together with its intended access rule.
