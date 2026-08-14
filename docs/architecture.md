# Architecture — Website SMKN 10 Semarang

Dokumen keputusan teknis hasil diskusi. Konteks lomba: [goals.md](goals.md) · Data sekolah: [info.md](info.md)

**Status:**
- ✅ **Situs Publik — FINAL** (disepakati Agustus 2026)
- 🔄 **Management (API + Admin) — masih dalam diskusi** (menunggu detail hosting milik pengembang: jenis hosting, dukungan Node.js, MySQL, spesifikasi server)

---

## 1. Situs Publik — FINAL ✅

### 1.1 Prinsip

1. **Terringan** — HTML + CSS + JavaScript vanilla. Nol framework, nol runtime React. Halaman publik nyaris tanpa JavaScript kecuali bagian yang butuh (form, chatbot).
2. **Tercepat** — HTML statis disajikan dari CDN; konten sudah tertanam saat halaman diterima browser.
3. **Konten 100% dari API** — tidak ada konten yang di-hardcode di HTML. Sumber kebenaran tunggal: database yang dikelola admin.
4. **SEO maksimal** — dicapai lewat pre-render (lihat 1.2), bukan dengan mengorbankan poin 3.

### 1.2 Pola: Pre-render saat Build (Opsi terpilih)

```
SAAT DEPLOY (bukan saat pengunjung datang):
  Script build (Node.js vanilla)
      → memanggil semua endpoint API GET
      → menyuntikkan data ke template HTML
      → menghasilkan file HTML statis final
      → naik ke CDN

SAAT PENGUNJUNG / GOOGLEBOT DATANG:
  Menerima HTML yang kontennya SUDAH JADI → instan & terindeks penuh

SAAT ADMIN MENGUBAH KONTEN:
  Tombol "Terbitkan" di admin → webhook memicu build ulang (±1 menit) → HTML segar
```

Alasan pemilihan (dibanding 2 opsi lain yang dipertimbangkan):
- *100% API di browser* — ditolak: pengindeksan Google lebih lambat/kurang andal, kata kunci di isi halaman melemah, mesin pencari non-Google buruk merender JavaScript.
- *Hybrid (statis + API)* — ditolak: sebagian konten jadi hardcode, dua sumber kebenaran.
- **Pre-render** — konten tetap semuanya dari API *dan* SEO/kecepatan setara statis murni. Harga: konten baru tampil setelah build ±1 menit (dapat diterima untuk konten sekolah).

Pengecualian yang tetap memanggil API langsung dari browser (memang harus real-time):
- Form pendaftar PPIB dan form alumni BKK (POST)
- Chatbot (POST `/api/chat`)

### 1.3 Halaman

| Route | Isi |
|---|---|
| `/` | Landing: hero maritim, angka kunci (1954, 10 jurusan, mitra, lulusan), jurusan per rumpun, prestasi sorotan, lulusan terbaik, logo mitra industri, teaser BLUD, footer (alamat + peta + kontak) |
| `/jurusan` | Daftar 10 jurusan per rumpun |
| `/jurusan/[nama]` | Detail per jurusan: deskripsi, kompetensi, prospek karier, galeri, mitra terkait — 10 halaman, senjata SEO |
| `/ppib` | Timeline alur pendaftaran, syarat, jadwal, kuota, FAQ (accordion), form minat |
| `/blud` | Grid produk (foto, harga, jurusan pembuat), filter kategori, tombol "Pesan via WhatsApp" per produk |
| `/bkk` | Tab Lowongan Kerja (filter jurusan, deadline) + tab Info PKL (mitra, alur), form pendaftaran alumni |
| `/prestasi` | Arsip semua prestasi (landing hanya sorotan) |
| `/alumni` | Arsip lulusan terbaik + testimoni |

Widget **chatbot** melayang di pojok kanan bawah semua halaman.

### 1.4 Kontrak API yang Dikonsumsi Publik

| Endpoint | Method | Isi |
|---|---|---|
| `/api/profil` | GET | Identitas sekolah, sejarah, visi, kontak |
| `/api/jurusan` | GET | 10 jurusan + deskripsi + prospek karier |
| `/api/ppib` | GET | Alur, syarat, jadwal, kuota, FAQ |
| `/api/prestasi` | GET | Daftar prestasi (judul, tingkat, tahun, foto) |
| `/api/alumni` | GET | Lulusan terbaik + testimoni |
| `/api/mitra` | GET | Partner industri (nama, logo, bidang) |
| `/api/produk` | GET | Katalog BLUD |
| `/api/lowongan` | GET | Lowongan BKK |
| `/api/pengumuman` | GET | Pengumuman |
| `/api/ppib/daftar` | POST | Form minat pendaftar (real-time) |
| `/api/bkk/daftar` | POST | Form alumni (real-time) |
| `/api/chat` | POST | Chatbot → Gemini (real-time) |

### 1.5 Chatbot (sisi publik)

- Widget vanilla JS di semua halaman → POST `/api/chat`.
- API key Gemini hanya ada di server — tidak pernah menyentuh browser.
- Model: Gemini Flash via free tier Google AI Studio (gratis, tanpa kartu kredit).
- Pagar: hanya menjawab seputar SMKN 10 Semarang; di luar topik / tidak tahu → arahkan ke WhatsApp sekolah (+62 812-2690-7008).
- Fallback kuota habis: FAQ statis + tombol WhatsApp — chatbot tidak pernah terlihat mati.

### 1.6 Desain

- Tema **maritim modern**: dasar navy (biru laut dalam), aksen emas/oranye untuk tombol & angka, tipografi besar tegas, banyak ruang kosong.
- Warna didefinisikan sebagai CSS custom properties (design token) di satu file — ganti tema = ubah beberapa baris.
- **Mobile-first**: mayoritas pengunjung dari HP.
- Skeleton loader untuk bagian yang menunggu API real-time.
- Meta tag (title, description, og-image) per halaman, sitemap, dan structured data untuk SEO.
- Target Lighthouse 90+ (performa, aksesibilitas, SEO).

### 1.7 Hosting Publik

- CDN **Vercel/Netlify free tier** — global, HTTPS otomatis, tidak pernah tidur, auto-deploy dari GitHub.
- Build ulang dipicu Deploy Hook (dipanggil tombol "Terbitkan" di admin).

---

## 2. Management (API + Admin) — 🔄 MASIH DALAM DISKUSI

Kesepakatan sementara (belum final):

- **Express.js** — satu aplikasi: endpoint `/api/...` + halaman `/admin`.
- **Admin UI**: EJS + CSS/JS vanilla.
- **Database: MySQL** (dikunci) — akses via library `mysql2`, SQL langsung tanpa ORM. Development lokal: Laragon/XAMPP.
- **Login**: bcrypt + cookie httpOnly bertanda tangan.
- **Halaman admin**: Login → Dashboard → CRUD (Prestasi, Alumni, Mitra, Produk BLUD, Lowongan BKK, Pengumuman, Jurusan, Profil) → Inbox (pendaftar PPIB & BKK) → tombol "Terbitkan".

Menunggu jawaban sebelum final:
1. Jenis hosting milik pengembang: shared cPanel atau VPS?
2. Apakah ada "Setup Node.js App" di cPanel? (Menentukan: semua satu atap di hosting sendiri vs Express di Vercel + MySQL remote di hosting)
3. Konfirmasi MySQL + phpMyAdmin tersedia.
4. Penyimpanan gambar: disk hosting sendiri (jika persisten) vs Cloudinary.
5. Spesifikasi & lokasi server.
