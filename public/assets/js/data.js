/* ═══════════════════════════════════════════════════════════
   PEMUAT KONTEN DINAMIS
   Mengambil JSON dari SITE_CONFIG.API_BASE lalu MENGGANTI konten
   contoh yang tertanam di HTML. Bila fetch gagal (offline/file://),
   konten tertanam tetap tampil — halaman tidak pernah kosong.

   Hook di HTML: elemen dengan atribut data-source, contoh:
     <div class="prestasi-grid" data-source="prestasi">…fallback…</div>
   ═══════════════════════════════════════════════════════════ */
(function () {
  "use strict";
  const BASE = (window.SITE_CONFIG && window.SITE_CONFIG.API_BASE) || "";
  if (!BASE) return;

  const get = async (name) => {
    // parameter ?v per menit menembus cache CDN raw GitHub (TTL ±5 menit),
    // sehingga perubahan konten tampil paling lambat 60 detik
    const v = Math.floor(Date.now() / 60000);
    const res = await fetch(`${BASE}/${name}.json?v=${v}`, { cache: "no-cache" });
    if (!res.ok) throw new Error(`${name}: HTTP ${res.status}`);
    const data = await res.json();
    // buang kunci internal "_catatan" pada item pertama data mock
    return Array.isArray(data) ? data.map(({ _catatan, ...d }) => d) : data;
  };
  const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const bulanID = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  const arrowSvg = '<svg class="ic anno__arrow" aria-hidden="true"><use href="#i-arrow"/></svg>';

  /* ── renderer per jenis data ── */
  const RENDER = {
    prestasi(el, rows) {
      const badge = (t) =>
        t === "nasional" ? '<span class="pcard__badge pcard__badge--nas">Nasional</span>'
        : t === "provinsi" ? '<span class="pcard__badge pcard__badge--prov">Provinsi</span>'
        : '<span class="pcard__badge">Kota</span>';
      el.innerHTML = rows.filter((r) => el.dataset.only !== "unggulan" || r.unggulan).map((r) => `
        <article class="pcard reveal is-in">
          <div class="pcard__media photo-ph"><span class="photo-ph__label">Foto Prestasi</span>
            ${r.foto && r.foto.startsWith("http") ? `<img src="${esc(r.foto)}" alt="" loading="lazy" onerror="this.remove()">` : ""}
            ${badge(r.tingkat)}
          </div>
          <div class="pcard__body">
            <span class="pcard__year">${esc(r.tahun)}</span>
            <h3>${esc(r.judul)}</h3>
            <p>${esc(r.peraih)} — ${esc(r.deskripsi)}</p>
          </div>
        </article>`).join("");
    },

    alumni(el, rows) {
      el.innerHTML = rows.filter((r) => el.dataset.only !== "unggulan" || r.unggulan).map((r) => {
        const inisial = r.nama.split(" ").map((w) => w[0]).slice(0, 2).join("");
        return `
        <figure class="acard reveal is-in">
          <blockquote>“${esc(r.testimoni)}”</blockquote>
          <figcaption>
            <span class="acard__avatar" aria-hidden="true">${esc(inisial)}</span>
            <div><strong>${esc(r.nama)}</strong><small>Lulusan ${esc(r.tahunLulus)} — ${esc(r.penempatan)}</small></div>
          </figcaption>
        </figure>`;
      }).join("");
    },

    mitra(el, rows) {
      const logos = rows.map((r) => `<span class="mlogo">${esc(r.nama)}</span>`).join("");
      el.innerHTML = logos + logos; // digandakan untuk loop marquee mulus
    },

    pengumuman(el, rows) {
      el.innerHTML = rows.slice(0, parseInt(el.dataset.limit || "3", 10)).map((r) => {
        const d = new Date(r.tanggal + "T00:00:00");
        return `
        <a href="berita.html?k=pengumuman" class="anno reveal is-in">
          <span class="anno__date"><strong>${String(d.getDate()).padStart(2, "0")}</strong><small>${bulanID[d.getMonth()]} ${d.getFullYear()}</small></span>
          <span class="anno__body"><strong>${esc(r.judul)}</strong><small>${esc(r.isi)}</small></span>
          ${arrowSvg}
        </a>`;
      }).join("");
    },

    lowongan(el, rows) {
      el.innerHTML = rows.map((r) => `
        <div class="low-card reveal is-in">
          <div class="low-card__top">
            <div><h3>${esc(r.posisi)}</h3><span class="low-card__company">${esc(r.perusahaan)} · ${esc(r.lokasi)}</span></div>
            <span class="low-deadline">s.d. ${esc(new Date(r.deadline + "T00:00:00").toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }))}</span>
          </div>
          <div class="low-chips">${(r.jurusanTarget || []).map((j) => `<span class="low-chip">${esc(j.replace(/-/g, " ").toUpperCase())}</span>`).join("")}</div>
          <p>${esc(r.deskripsi)}</p>
          <a class="btn btn--navy btn--sm" style="justify-self:start" href="https://wa.me/${window.SITE_CONFIG.WA}?text=${encodeURIComponent(`Halo BKK, saya ingin melamar posisi ${r.posisi} di ${r.perusahaan}`)}" target="_blank" rel="noopener">Lamar via BKK</a>
        </div>`).join("");
    },
  };

  document.querySelectorAll("[data-source]").forEach(async (el) => {
    const name = el.dataset.source;
    if (!RENDER[name]) return;
    try {
      RENDER[name](el, await get(name));
    } catch (err) {
      // fetch gagal → biarkan konten fallback yang tertanam tetap tampil
      console.warn("[data]", err.message);
    }
  });
})();
