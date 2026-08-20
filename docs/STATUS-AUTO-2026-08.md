# Laporan Otomatis: Jalur A (SEO On-Page) Selesai & Langkah Berikutnya
_Dibuat: 2026-08-20_

## Yang Sudah Selesai & Live di Production

### 1. Internal Linking Body (commit ba62230)
- 8 halaman lokal + orphan kini punya blok "Halaman Terkait" dengan 4 link kontekstual per halaman
- Setiap blok self-contained (inline styles) agar tampil sesuai tema halaman (gelap/terang)
- Build+validate: PASS 32 routes; Indexing API push: 200 OK untuk ke-8 halaman

### 2. Footer Global
- Kolom "Areas We Serve" ditambahkan -> semua 30 URL sitemap punya link dari footer

### 3. LocalBusiness Schema (commit ca12482)
- @type: [LocalBusiness, Architect, GeneralContractor]; @id + hasMap ditambahkan; JSON-LD valid & live

### 4. Clarity Friction Analysis (3 hari, 23 sesi manusia)
- Rage/Error clicks: 0; Dead clicks: 1 (4%); Pages/session: 1.56; Page #1: biaya-bangun-rumah-lombok

### 5. Combined Baseline Report (docs/BASELINE-DIAGNOSTIC-2026-08.md)
- GSC 28d: www property 4 halaman dapat impresi (naik dari 2). biaya-bangun = pos 5.0
- GA4: <150 sesi/bln, direct dominan (88), organic 31
- Diagnosis: bottleneck = traffic volume + ranking, BUKAN UX/friction

---

## Butuh Aksi Anda (bukan error AI - perlu grant permission)

### Meta Facebook - Posting Otomatis TERHALANG SCOPE
- Ada page token valid untuk "Atelier Nusa" (ID 984640464723839, 24 fans)
- Scope dimiliki: pages_read_engagement, instagram_basic (READ-only)
- TIDAK ada: pages_manage_posts -> publish diblokir (error #200)

Langkah Anda:
1. Buka: https://developers.facebook.com/apps/922518970675530/permissions
2. Grant pages_manage_posts untuk Halaman Atelier Nusa
3. Atau buat token baru via Graph Explorer dgn scope pages_manage_posts
4. Kirim token baru -> saya langsung post 3 draft (A: biaya rumah, B: villa, C: studio intro)

### Google Business Profile - Quota Project = 0
- Token OAuth valid & scope lengkap (business.manage) TAPI quota project 788156616616 = 0 (error 429)
- Ini restriksi akun, harus di-handle manual atau via form:

Option A (rekomendasi, gratis, sekarang): Dashboard manual
- https://business.google.com/ -> listing "Atelier Nusa"
- Update jam, foto, services, Q&A; respon review; buat GBP posts

Option B: Request API access
- https://support.google.com/business/contact/GBP_API_access
- Pilih "Request access to My Business API"

---

## Rekomendasi Prioritas Selanjutnya
1. Tunggu efek internal-linking (2-4 minggu) -> ukur ulang GSC/GA4/Clarity pages-per-session
2. Grant scope FB -> saya post 3 draft (biaya dulu, high-intent)
3. GBP manual weekly update (lebih cepat dari organik untuk query lokal)
4. GBP API automation setelah quota approval (jika perlu)

## Commit History
ca12482 (schema) -> ba62230 (internal links) -> 132ed6b (baseline report)
Semua pushed & verified live (bundle main-RQiXHcpw.js).
