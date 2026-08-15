/* ═══════════════════════════════════════════════════════════
   Komponen bersama (navbar, footer, chat, sprite ikon)
   Satu sumber — di-inject ke setiap halaman lewat placeholder:
     <div data-component="sprite"></div>
     <header data-component="navbar" data-active="spmb"></header>
     <footer data-component="footer"></footer>
     <div data-component="chat"></div>
   Muat SEBELUM main.js (keduanya defer, urutan dipertahankan).
   ═══════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  // Prefix link beranda: di index cukup "#section", di halaman lain "index.html#section"
  const onHome = /(^|\/)(index\.html)?$/.test(location.pathname);
  const home = (hash) => (onHome ? hash : "index.html" + hash);
  const WA = "https://wa.me/6281226907008";

  const caret = '<svg class="ic nav-caret" aria-hidden="true"><use href="#i-caret"/></svg>';

  const SPRITE = `
  <svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
    <symbol id="i-phone" viewBox="0 0 24 24"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.13.96.36 1.9.7 2.8a2 2 0 0 1-.45 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.27a2 2 0 0 1 2.1-.45c.9.34 1.84.57 2.8.7A2 2 0 0 1 22 16.9z"/></symbol>
    <symbol id="i-mail" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></symbol>
    <symbol id="i-anchor" viewBox="0 0 24 24"><circle cx="12" cy="5" r="3"/><path d="M12 8v13M5 12H2a10 10 0 0 0 20 0h-3"/></symbol>
    <symbol id="i-ship" viewBox="0 0 24 24"><path d="M4 15l8-3 8 3-1.8 4.5a1 1 0 0 1-.93.5H6.7a1 1 0 0 1-.92-.5L4 15z"/><path d="M12 12V4m0 0 4 2.5L12 9"/></symbol>
    <symbol id="i-gear" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3.2"/><path d="M12 2v3m0 14v3M2 12h3m14 0h3M4.9 4.9 7 7m10 10 2.1 2.1M19.1 4.9 17 7M7 17l-2.1 2.1"/></symbol>
    <symbol id="i-flame" viewBox="0 0 24 24"><path d="M12 22c4.2 0 7-2.8 7-6.8 0-3.7-2.6-5.7-3.8-8.5-1.9 1.6-2.4 3.6-2.4 3.6S11.6 7 8.8 5C8.8 9 5 10.8 5 15.2c0 4 2.8 6.8 7 6.8z"/></symbol>
    <symbol id="i-car" viewBox="0 0 24 24"><path d="M3 16v-5l2.4-4.2A2 2 0 0 1 7.1 6h6.3a2 2 0 0 1 1.6.8L18 11h1a2 2 0 0 1 2 2v3h-2.2"/><circle cx="7.5" cy="16.5" r="2"/><circle cx="16.5" cy="16.5" r="2"/><path d="M9.5 16.5h5"/></symbol>
    <symbol id="i-moto" viewBox="0 0 24 24"><circle cx="5.5" cy="16.5" r="3"/><circle cx="18.5" cy="16.5" r="3"/><path d="M5.5 16.5h5l3.5-6h3M10 7h4l1.5 3.5"/></symbol>
    <symbol id="i-drop" viewBox="0 0 24 24"><path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/></symbol>
    <symbol id="i-gamepad" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="11" rx="4"/><path d="M6.5 12.5h4m-2-2v4"/><path d="M15.5 11.5h.01M18 13.5h.01" stroke-width="2.6"/></symbol>
    <symbol id="i-box" viewBox="0 0 24 24"><path d="M21 8 12 3 3 8v8l9 5 9-5V8z"/><path d="M3 8l9 5 9-5M12 21v-8"/></symbol>
    <symbol id="i-trend" viewBox="0 0 24 24"><path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/></symbol>
    <symbol id="i-chat" viewBox="0 0 24 24"><path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5c-1.3 0-2.6-.3-3.8-.9L3 21l1.9-5.7A8.5 8.5 0 1 1 21 11.5z"/></symbol>
    <symbol id="i-arrow" viewBox="0 0 24 24"><path d="M5 12h14m-7-7 7 7-7 7"/></symbol>
    <symbol id="i-send" viewBox="0 0 24 24"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z"/></symbol>
    <symbol id="i-pin" viewBox="0 0 24 24"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/></symbol>
    <symbol id="i-caret" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></symbol>
  </defs></svg>`;

  const NAVBAR = (active) => `
  <div class="container navbar__inner">
    <a href="${onHome ? "#beranda" : "index.html"}" class="navbar__brand">
      <span class="navbar__logo" aria-hidden="true"><svg class="ic" style="width:24px;height:24px"><use href="#i-anchor"/></svg></span>
      <span class="navbar__name"><strong>SMKN 10 SEMARANG</strong><small>OFFICIAL</small></span>
    </a>
    <nav class="navbar__menu" id="navMenu" aria-label="Menu utama">
      <a href="${onHome ? "#beranda" : "index.html"}" class="nav-link ${active === "beranda" ? "is-active" : ""}">Beranda</a>
      <div class="nav-item">
        <a href="profil.html" class="nav-link nav-link--parent ${active === "profil" ? "is-active" : ""}">Profil ${caret}</a>
        <div class="nav-drop">
          <a href="profil.html#sejarah">Sejarah</a>
          <a href="profil.html#visi-misi">Visi, Misi &amp; Tujuan</a>
          <a href="profil.html#struktur">Struktur Organisasi</a>
        </div>
      </div>
      <a href="berita.html" class="nav-link ${active === "berita" ? "is-active" : ""}">Berita</a>
      <div class="nav-item">
        <a href="berita.html?k=agenda" class="nav-link nav-link--parent">Kegiatan ${caret}</a>
        <div class="nav-drop">
          <a href="berita.html?k=agenda">Agenda</a>
          <a href="berita.html?k=pengumuman">Pengumuman</a>
          <a href="berita.html?k=kesiswaan">Kesiswaan</a>
          <a href="berita.html?k=komunitas-belajar">Komunitas Belajar</a>
          <a href="berita.html?k=parenting">Parenting</a>
          <a href="berita.html?k=kerohanian">Kerohanian</a>
          <a href="berita.html?k=laporan-bos">Laporan BOS</a>
          <a href="berita.html?k=fim">Forum Ilmiah Mingguan</a>
        </div>
      </div>
      <div class="nav-item">
        <a href="blud.html" class="nav-link nav-link--parent ${active === "tefa" ? "is-active" : ""}">Teaching Factory ${caret}</a>
        <div class="nav-drop">
          <a href="blud.html">Produk &amp; Jasa</a>
          <a href="blud.html#divisi">Divisi</a>
          <a href="berita.html?k=mou">MOU Industri</a>
          <a href="berita.html?k=tefa">Berita Tefa</a>
        </div>
      </div>
      <div class="nav-item">
        <a href="prestasi.html" class="nav-link nav-link--parent ${active === "prestasi" ? "is-active" : ""}">Prestasi ${caret}</a>
        <div class="nav-drop">
          <a href="prestasi.html">Prestasi Sekolah</a>
          <a href="prestasi.html#alumni">Cerita Alumni</a>
          <a href="berita.html?k=guru-menulis">Guru Menulis</a>
          <a href="berita.html?k=siswa-menulis">Siswa Menulis</a>
        </div>
      </div>
      <div class="nav-item">
        <a href="spmb.html" class="nav-link nav-link--parent ${active === "spmb" ? "is-active" : ""}">SPMB ${caret}</a>
        <div class="nav-drop">
          <a href="spmb.html">Informasi SPMB</a>
          <a href="jurusan.html">Jurusan</a>
        </div>
      </div>
      <div class="nav-item">
        <a href="bkk.html" class="nav-link nav-link--parent ${active === "kerjasama" ? "is-active" : ""}">Kerjasama ${caret}</a>
        <div class="nav-drop">
          <a href="bkk.html">Mitra Industri</a>
          <a href="berita.html?k=perguruan-tinggi">Perguruan Tinggi</a>
          <a href="berita.html?k=instansi">Instansi Pemerintah</a>
          <a href="berita.html?k=swasta">Swasta</a>
          <a href="berita.html?k=pelatihan">Pelatihan</a>
          <a href="berita.html?k=studi-tiru">Studi Tiru</a>
          <a href="berita.html?k=narasumber">Narasumber</a>
        </div>
      </div>
      <a href="bkk.html" class="nav-link ${active === "bkk" ? "is-active" : ""}">BKK</a>
      <div class="nav-item">
        <a href="#" class="nav-link nav-link--parent" data-soon>Lainnya ${caret}</a>
        <div class="nav-drop nav-drop--right">
          <a href="berita.html?k=lsp-p1">LSP P1 — Uji Kompetensi</a>
          <a href="https://smkn10semarang.perpustakaan.co.id/" target="_blank" rel="noopener">Perpustakaan</a>
          <span class="nav-drop__label">SMK Pusat Keunggulan</span>
          <a href="berita.html?k=magang-guru">Magang Guru</a>
          <a href="berita.html?k=magang-jepang">Magang Jepang</a>
          <a href="berita.html?k=praktisi-mengajar">Praktisi Mengajar</a>
          <a href="berita.html?k=workshop">Workshop</a>
        </div>
      </div>
      <a href="spmb.html" class="btn btn--acc btn--sm navbar__cta">Daftar SPMB</a>
    </nav>
    <button class="navbar__burger" id="navBurger" aria-label="Buka menu" aria-expanded="false">
      <span></span><span></span><span></span>
    </button>
  </div>`;

  const FOOTER = `
  <div class="container footer__grid">
    <div>
      <p class="footer__brand"><strong>SMKN 10 SEMARANG</strong> OFFICIAL</p>
      <p><svg class="ic" aria-hidden="true"><use href="#i-pin"/></svg> Jl. Kokrosono No. 75, Panggung Kidul,<br>Semarang Utara, Kota Semarang, Jawa Tengah</p>
      <p>NPSN 20328947 · Akreditasi B</p>
      <p>Kepala Sekolah: Albasori, S.Pd.</p>
    </div>
    <div>
      <p class="footer__head">Menu</p>
      <a href="${home("#profil")}">Profil</a>
      <a href="jurusan.html">Jurusan</a>
      <a href="spmb.html">SPMB</a>
      <a href="blud.html">Teaching Factory</a>
      <a href="bkk.html">BKK</a>
    </div>
    <div>
      <p class="footer__head">Kontak</p>
      <a href="tel:0243515701">(024) 3515701</a>
      <a href="${WA}">+62 812-2690-7008</a>
      <a href="mailto:smk10smg@yahoo.co.id">smk10smg@yahoo.co.id</a>
    </div>
    <div>
      <p class="footer__head">Media Sosial</p>
      <a href="https://instagram.com/smkn10semarang" target="_blank" rel="noopener">Instagram @smkn10semarang</a>
      <a href="https://youtube.com/@VHS10TV" target="_blank" rel="noopener">YouTube @VHS10TV</a>
      <a href="https://smk10semarang.sch.id" target="_blank" rel="noopener">smk10semarang.sch.id</a>
    </div>
  </div>
  <div class="footer__bar"><div class="container">© 2026 SMKN 10 Semarang — Sekolah Maritim &amp; Teknologi. Sejak 1954.</div></div>`;

  const CHAT = `
  <button class="chat-fab" id="chatFab" aria-label="Buka layanan informasi">
    <span class="chat-fab__pulse" aria-hidden="true"></span>
    <svg class="ic chat-fab__icon" aria-hidden="true"><use href="#i-chat"/></svg>
  </button>
  <div class="chat-panel" id="chatPanel" hidden>
    <div class="chat-panel__head">
      <strong>Layanan Informasi</strong>
      <button id="chatClose" aria-label="Tutup">✕</button>
    </div>
    <div class="chat-panel__body">
      <div class="chat-msg">Selamat datang di SMKN 10 Semarang. Mau tanya soal apa? Pilih topiknya, nanti langsung tersambung ke petugas kami lewat WhatsApp.</div>
      <div class="chat-quick">
        <a href="${WA}?text=${encodeURIComponent("Halo, saya mau tanya soal pendaftaran murid baru (SPMB)")}" target="_blank" rel="noopener">Pendaftaran (SPMB)</a>
        <a href="${WA}?text=${encodeURIComponent("Halo, saya mau tanya soal jurusan di SMKN 10 Semarang")}" target="_blank" rel="noopener">Jurusan</a>
        <a href="${WA}?text=${encodeURIComponent("Halo, saya mau tanya soal lowongan kerja / BKK")}" target="_blank" rel="noopener">BKK / Lowongan</a>
        <a href="${WA}?text=${encodeURIComponent("Halo, saya mau pesan produk / jasa Teaching Factory")}" target="_blank" rel="noopener">Produk Teaching Factory</a>
        <a href="${WA}" target="_blank" rel="noopener">Pertanyaan Lain</a>
      </div>
      <p class="chat-note">Jam layanan: Senin–Jumat, 07.00–15.00 WIB</p>
    </div>
  </div>`;

  document.querySelectorAll("[data-component]").forEach((el) => {
    const name = el.dataset.component;
    if (name === "sprite") el.outerHTML = SPRITE;
    else if (name === "navbar") el.innerHTML = NAVBAR(el.dataset.active || "");
    else if (name === "footer") el.innerHTML = FOOTER;
    else if (name === "chat") el.outerHTML = CHAT;
  });
})();
