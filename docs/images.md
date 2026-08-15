# Panduan Ganti Foto

Semua foto saat ini adalah **placeholder dari Unsplash** (gratis). Untuk menggantinya dengan foto asli sekolah: cari tag `<img src="https://images.unsplash.com/...">` di file yang disebut, ganti `src` dengan path foto asli (mis. `assets/img/nama-foto.jpg`), dan letakkan file foto di `public/assets/img/`.

Setiap foto punya fallback otomatis: bila gagal dimuat, kotak berlabel tetap tampil (atribut `onerror`), jadi mengganti foto tidak akan pernah merusak layout.

## Daftar lokasi foto

| File | Bagian | Foto placeholder saat ini | Ganti dengan foto asli |
|---|---|---|---|
| `index.html` | Hero | Siswa di ruang kelas | Siswa SMKN 10 (kegiatan/apel/kelas) |
| `index.html` | Profil (besar) | Praktik berhelm keselamatan | Praktik kejuruan siswa |
| `index.html` | Profil (kecil) | Teknisi bengkel | Bengkel sekolah |
| `index.html` | Prestasi ×3 | Las, siswa perpustakaan, kode | Foto momen juara |
| `index.html` | Teaching Factory ×3 | Logam, laptop, teknisi | Foto divisi Tefa |
| `jurusan.html` | 10 kartu jurusan | Sesuai tema jurusan | Praktik tiap jurusan |
| `profil.html` | Fasilitas ×4 | Pelabuhan, mesin mobil, perpustakaan, komputer | Simulator kapal, bengkel, perpustakaan, lab |
| `blud.html` | 6 divisi | Sesuai tema divisi | Kegiatan tiap divisi |
| `prestasi.html` | Kartu prestasi | Dari `management/api/prestasi.json` (field `foto`) | Isi URL foto asli di JSON |

Foto yang datang dari API (`prestasi.json`, dsb.) diganti lewat field `foto` di file JSON — bukan di HTML.
