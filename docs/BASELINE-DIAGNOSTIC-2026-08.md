# Atelier Nusa — Baseline Diagnostik SEO & Konversi
_Dibuat otomatis: 2026-08-20 · Window: 2026-07-23 s/d 2026-08-19 (28 hari)_

## Ringkasan Eksekutif
Website sehat secara teknis & UX (tidak ada friksi konversi). **Satu-satunya bottleneck = volume traffic organik yang sangat kecil + ranking rendah** untuk halaman lokal. Ini baseline SEBELUM efek penuh perbaikan internal-linking (deployed hari ini) terlihat.

---

## 1. Google Search Console (28 hari)

| Properti | Clicks | Impressions | CTR | Avg Pos | Hal. dgn impresi |
|---|---|---|---|---|---|
| www.ateliernusa.id | 7 | 148 | 4.7% | 7.9 | 4 |
| ateliernusa.id | 1 | 68 | 1.5% | 7.7 | 2 |

**Halaman yang sudah dapat impresi (www, 28d):**
- `/` — 3 clk / 71 imp / pos 9.6
- `/biaya-bangun-rumah-lombok` — 3 clk / 73 imp / **pos 5.0** ✅ (halaman terkuat #2!)
- `/jasa-arsitek-lombok` — 1 clk / 11 imp / pos 21.6 (baru muncul — efek Indexing API)
- `/tanah-labuhan-lombok` — 0 clk / 1 imp / pos 1.0

**PROGRESS:** Sebelumnya hanya 2 halaman dapat impresi (`/` + `/services`). Sekarang **4 halaman** — `biaya-bangun-rumah-lombok` & `jasa-arsitek-lombok` mulai terindeks & tampil. Perbaikan indexing bekerja.

**Query striking-distance (pos 20-36, English) — peluang besar:**
architect lombok (23), lombok architect (24), construction lombok (20), contractor lombok (25), hospitality architect lombok (25), lombok interior design (34), resort architect lombok (36).
→ Google mulai kenal halaman-halaman ini tapi ranking masih rendah. Internal-linking + waktu akan menaikkannya.

---

## 2. Google Analytics 4 (28 hari) — 147 sesi, 34 konversi

| Channel | Sesi | Konversi | Engagement |
|---|---|---|---|
| Direct | 88 | 27 | 41% |
| Organic Search | 31 | 2 | 58% |
| Organic Social | 12 | 2 | 50% |
| AI Assistant | 8 | 3 | 50% |
| Referral | 8 | 0 | 50% |

**Insight:**
- Direct mendominasi (orang yang sudah tahu brand / dari WA/IG bio) — konversi bagus (27).
- Organic Search cuma 31 sesi → inilah yang harus dinaikkan lewat SEO.
- "AI Assistant" 8 sesi/3 konversi → orang menemukan via ChatGPT/Perplexity dll (efisiensi tinggi).

---

## 3. Microsoft Clarity (3 hari, 23 sesi manusia)

| Metrik friksi | Nilai | Status |
|---|---|---|
| Rage clicks | 0 | ✅ tidak ada |
| Error clicks | 0 | ✅ tidak ada |
| Script errors | 0 | ✅ bersih |
| Dead clicks | 1 (4%) | ✅ dapat diabaikan |
| Quickback clicks | 19 (13%) | ⚠️ minor |
| Avg scroll depth | 47% | orang baca separuh halaman |
| Pages/session | 1.56 | ⚠️ rendah (internal-link fix menargetkan ini) |

**Halaman terpopuler (3d):** `/biaya-bangun-rumah-lombok` (30) > `/` (26) > `/services` (5).
→ **Intent #1 pengunjung = BIAYA/harga.** Konsisten dengan GSC (halaman biaya = ranking terbaik).

---

## 4. Diagnosis Final
1. **Bukan masalah konversi/UX** — nol rage/error, JS bersih, CTA WhatsApp berfungsi.
2. **Masalah = volume + ranking.** Total <150 sesi/bulan; hanya 4 halaman terlihat di Google.
3. **Sinyal intent terkuat = "biaya bangun rumah"** — halaman biaya sudah pos 5. Perkuat cluster harga.
4. **Efek perbaikan (footer + internal-link body, deployed hari ini) belum ter-crawl penuh** — ukur ulang 2-4 minggu.

## 5. Rekomendasi Prioritas
- **A (jalan):** SEO on-page + internal linking — SUDAH deployed. Tunggu re-crawl.
- **B:** Perkuat konten cluster "biaya" (halaman biaya sudah menang; tambah kalkulator/tabel harga → tangkap intent transaksional).
- **C:** GBP (Google Maps) — untuk query "arsitek mataram/lombok" lokal, GBP lebih cepat dari organik. (Terblokir quota API — lihat catatan.)
- **D:** Google Ads jika mau hasil instan (butuh budget).

## 6. Metrik untuk Diukur Ulang (2-4 minggu)
- Jumlah halaman dengan impresi (target: 4 → 10+).
- Posisi `/jasa-arsitek-lombok`, `/arsitek-mataram` (target: <15).
- Pages/session Clarity (target: 1.56 → 2.0+).
- Organic Search sesi GA4 (target: 31 → 50+).
