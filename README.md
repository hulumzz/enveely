# Enveely — Invite Your Beloved People.

Platform pembuat **undangan pernikahan digital** yang *design-first*: setiap template punya Design DNA lengkap (komposisi, tipografi, ornamen, treatment foto) — bukan sekadar ganti warna.

## Stack

- **Vanilla JS (ES modules) + Vite** — tanpa framework, output static
- **Firebase Firestore + Analytics** — persistensi & metrik (Storage tidak dipakai)
- **ImgBB (primary) + Freeimage.host (failover)** — hosting gambar dengan kompresi client-side
- **Cloudflare Pages** — hosting & SPA fallback (`public/_redirects`)

## Menjalankan Proyek

```powershell
npm install
copy .env.example .env.local   # isi nilai Firebase + API key image host
npm.cmd run dev                # Windows PowerShell (npm.ps1 diblokir execution policy)
```

Dev server: `http://localhost:5173`.

> Di PowerShell gunakan `npm.cmd` (bukan `npm`) karena `npm.ps1` sering diblokir execution policy.

### Environment Variables (`.env.local`, jangan di-commit)

| Variable | Sumber |
|---|---|
| `VITE_FIREBASE_API_KEY` dst. | Firebase Console → Project settings → Web app config |
| `VITE_IMGBB_API_KEY` | https://api.imgbb.com/ → "Get API key" |
| `VITE_FREEIMAGE_API_KEY` | https://freeimage.host → akun → API |

Tanpa `.env.local` aplikasi tetap jalan dalam **mode lokal** (draft di localStorage, upload gambar butuh key).

## Alur Produk

```
/                    Landing
/templates           Galeri 6 keluarga template × 3 varian
/templates/:id       Detail template + Design DNA
/templates/:id/preview/:variant   Live preview (Mobile/Desktop)
/create              Wizard: pilih desain → data dasar
/builder/:id         Editor: section navigator · canvas live · property panel
/dashboard           Daftar draft lokal
/invite/:id          Undangan publik (cover gate + musik + RSVP/wishes)
```

## Publish & Share

1. Builder → **Publikasikan** → checklist konten.
2. Tanpa Firebase: status tersimpan lokal, share link hanya berlaku di perangkat ini.
3. Dengan Firebase: dokumen `invitations/{id}` berstatus `published` → link `/invite/{id}` aktif untuk publik.
4. Modal share: salin link, WhatsApp (pesan terisi otomatis), Web Share API.

## Deploy ke Cloudflare Pages

- Build command: `npm run build`
- Output directory: `dist`
- SPA fallback sudah disiapkan lewat `public/_redirects`
- Tambahkan environment variables (daftar di atas) di dashboard Cloudflare

Opsional (Firebase tooling): `firebase.json` tersedia untuk deploy ke Firebase Hosting dan men-deploy `firestore.rules` + indexes.

## Firestore Security Model (ringkas)

- Public read hanya untuk `status == 'published'`.
- Draft di-scope per perangkat via `deviceId` (bukan identitas kuat — lihat Blueprint §8).
- RSVP/wishes: public create dengan validasi field ketat; update/delete dibatasi owner.
- Rules lengkap: `firestore.rules`. Uji dengan emulator sebelum produksi.

## Arsitektur Inti

```
CONTENT  +  TEMPLATE DNA  +  VARIANT DNA  +  SECTION CONFIG
                        ↓
                  RENDER ENGINE  →  INVITATION
```

- Content ≠ Design: ganti template tanpa kehilangan data.
- Renderer murni fungsi (tidak menyentuh Firestore).
- ImageService abstraction: provider bisa diganti (mis. Cloudflare R2 nanti) tanpa mengubah konten.

Dokumen sumber: `Blueprint-1.md` (teknis) dan `Design-1.md` (UI/UX).
