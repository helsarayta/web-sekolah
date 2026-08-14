/* ═══════════════════════════════════════════════════════════
   SMKN 10 SEMARANG — Interaksi & Animasi (vanilla JS, tanpa library)
   - Navbar solid saat scroll + menu mobile
   - Judul hero muncul kata-per-kata
   - Reveal on scroll (IntersectionObserver)
   - Statistik berhitung naik
   - Parallax hero (scroll + gerakan mouse)
   - Efek tilt kartu foto
   - Filter rumpun jurusan
   - Panel chatbot
   Menghormati prefers-reduced-motion.
   ═══════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  // Tandai bahwa JS aktif — CSS hanya menyembunyikan elemen reveal bila kelas ini ada,
  // sehingga tanpa JS (atau bila gagal) konten tetap tampil penuh.
  document.documentElement.classList.add("js-anim");

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouch = window.matchMedia("(pointer: coarse)").matches;

  /* ── 1. Navbar: solid saat scroll ── */
  const navbar = document.getElementById("navbar");
  const onScrollNav = () => navbar.classList.toggle("is-scrolled", window.scrollY > 24);
  onScrollNav();
  window.addEventListener("scroll", onScrollNav, { passive: true });

  /* ── 2. Menu mobile ── */
  const burger = document.getElementById("navBurger");
  const menu = document.getElementById("navMenu");
  burger.addEventListener("click", () => {
    const open = menu.classList.toggle("is-open");
    burger.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Tutup menu" : "Buka menu");
  });
  const isDrawer = () => window.matchMedia("(max-width: 1280px)").matches;
  // di mode drawer: klik menu induk membuka/menutup submenu (accordion)
  menu.querySelectorAll(".nav-item > .nav-link--parent").forEach((parent) => {
    parent.addEventListener("click", (e) => {
      if (isDrawer()) {
        e.preventDefault();
        const item = parent.parentElement;
        const wasOpen = item.classList.contains("is-open");
        menu.querySelectorAll(".nav-item.is-open").forEach((i) => i.classList.remove("is-open"));
        if (!wasOpen) item.classList.add("is-open");
      }
    });
  });
  // link "segera hadir" belum punya halaman
  document.querySelectorAll("[data-soon]").forEach((a) => {
    a.setAttribute("title", "Halaman segera hadir");
    a.addEventListener("click", (e) => { if (a.getAttribute("href") === "#") e.preventDefault(); });
  });
  menu.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", (e) => {
      if (e.defaultPrevented) return; // menu induk drawer / link segera-hadir: jangan tutup drawer
      menu.classList.remove("is-open");
      burger.classList.remove("is-open");
      burger.setAttribute("aria-expanded", "false");
    })
  );

  /* ── 3. Judul hero: pecah per kata, animasi berurutan ── */
  const heroTitle = document.getElementById("heroTitle");
  if (heroTitle && !reduceMotion) {
    const splitWords = (node) => {
      [...node.childNodes].forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE) {
          const frag = document.createDocumentFragment();
          // pisah per kata, tapi JANGAN putus di non-breaking space (&nbsp;)
          child.textContent.split(/([^\S ]+)/).forEach((part) => {
            if (/^\s+$/.test(part) || part === "") {
              frag.appendChild(document.createTextNode(part));
            } else {
              const w = document.createElement("span");
              w.className = "w";
              w.textContent = part;
              frag.appendChild(w);
            }
          });
          node.replaceChild(frag, child);
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          splitWords(child);
        }
      });
    };
    splitWords(heroTitle);
    heroTitle.querySelectorAll(".w").forEach((w, i) => {
      w.style.animationDelay = `${0.15 + i * 0.09}s`;
    });
    requestAnimationFrame(() => heroTitle.classList.add("is-in"));
  }

  /* ── 4. Reveal hero items berurutan (badge, subtitle, tombol, stats) ── */
  document.querySelectorAll(".hero .reveal-item").forEach((el, i) => {
    el.style.transitionDelay = `${0.5 + i * 0.18}s`;
    requestAnimationFrame(() => el.classList.add("is-in"));
  });

  /* ── 5. Reveal on scroll ── */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  document.querySelectorAll(".reveal").forEach((el, i) => {
    el.style.transitionDelay = `${(i % 4) * 0.1}s`; // stagger per kelompok kartu
    revealObserver.observe(el);
  });
  // Jaring pengaman: apa pun yang terjadi, seluruh konten tampil maksimal 2 detik setelah load
  window.addEventListener("load", () =>
    setTimeout(() => document.querySelectorAll(".reveal:not(.is-in)").forEach((el) => el.classList.add("is-in")), 2000)
  );

  /* ── 6. Statistik berhitung naik ── */
  const animateCount = (el) => {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || "";
    const plain = el.dataset.plain === "true"; // tahun: tanpa pemisah ribuan
    const dur = 1600;
    const start = performance.now();
    const fmt = (n) => (plain ? String(n) : n.toLocaleString("id-ID"));
    const tick = (now) => {
      const t = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - t, 4); // ease-out-quart
      el.textContent = fmt(Math.round(target * eased)) + suffix;
      if (t < 1) requestAnimationFrame(tick);
    };
    if (reduceMotion) { el.textContent = fmt(target) + suffix; return; }
    requestAnimationFrame(tick);
  };
  const statObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          statObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );
  document.querySelectorAll("[data-count]").forEach((el) => statObserver.observe(el));

  /* ── 7. Parallax hero: scroll + mouse ── */
  const hero = document.querySelector(".hero");
  if (hero && !reduceMotion && !isTouch) {
    const layers = hero.querySelectorAll(".layer[data-depth]");
    // faktor per depth: makin dekat makin cepat
    const factor = { 0: 0.1, 1: 0.22, 2: 0.4, 3: 0.6, 5: 0.9 };
    let mouseX = 0, mouseY = 0, scrollY = 0, raf = null;

    const apply = () => {
      raf = null;
      layers.forEach((layer) => {
        const d = layer.dataset.depth;
        if (d === "4") return; // konten utama tidak digeser
        const f = factor[d] ?? 0.3;
        const tx = mouseX * 22 * f;
        const ty = mouseY * 14 * f + scrollY * 0.25 * f;
        layer.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
      });
    };
    const schedule = () => { if (!raf) raf = requestAnimationFrame(apply); };

    hero.addEventListener("mousemove", (e) => {
      const r = hero.getBoundingClientRect();
      mouseX = (e.clientX / r.width - 0.5) * 2;   // -1 … 1
      mouseY = (e.clientY / r.height - 0.5) * 2;
      schedule();
    }, { passive: true });

    window.addEventListener("scroll", () => {
      const r = hero.getBoundingClientRect();
      if (r.bottom > 0) { scrollY = -r.top; schedule(); }
    }, { passive: true });
  }

  /* ── 8. Tilt kartu foto mengikuti kursor ── */
  if (!reduceMotion && !isTouch) {
    document.querySelectorAll(".tilt-card").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(700px) rotateY(${x * 7}deg) rotateX(${-y * 7}deg) translateY(-4px)`;
      });
      card.addEventListener("mouseleave", () => { card.style.transform = ""; });
    });
  }

  /* ── 9. Filter rumpun jurusan ── */
  const tabs = document.querySelectorAll(".rumpun-tab");
  const cards = document.querySelectorAll(".jcard");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("is-active"));
      tab.classList.add("is-active");
      const rumpun = tab.dataset.rumpun;
      cards.forEach((card, i) => {
        const show = rumpun === "semua" || card.dataset.rumpun === rumpun;
        card.classList.toggle("is-hidden", !show);
        if (show && !reduceMotion) {
          // animasi masuk ulang saat filter berganti
          card.classList.remove("is-in");
          card.style.transitionDelay = `${(i % 5) * 0.06}s`;
          requestAnimationFrame(() => requestAnimationFrame(() => card.classList.add("is-in")));
        }
      });
    });
  });

  /* ── 10. Panel chatbot ── */
  const fab = document.getElementById("chatFab");
  const panel = document.getElementById("chatPanel");
  const closeBtn = document.getElementById("chatClose");
  if (fab && panel && closeBtn) {
    fab.addEventListener("click", () => {
      panel.hidden = !panel.hidden;
      fab.setAttribute("aria-label", panel.hidden ? "Buka layanan informasi" : "Tutup layanan informasi");
    });
    closeBtn.addEventListener("click", () => { panel.hidden = true; });
  }

  /* ── 11. Preloader ── */
  const preloader = document.getElementById("preloader");
  const hidePreloader = () => preloader && preloader.classList.add("is-done");
  if (document.readyState === "complete") {
    hidePreloader();
  } else {
    window.addEventListener("load", () => setTimeout(hidePreloader, 350));
    setTimeout(hidePreloader, 2800); // jaring pengaman bila aset lambat
  }

  /* ── 12. Progress bar baca ── */
  const progress = document.getElementById("scrollProgress");
  if (progress) {
    const onProgress = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
    };
    onProgress();
    window.addEventListener("scroll", onProgress, { passive: true });
  }

  /* ── 12b. Form → WhatsApp (tanpa backend): form[data-wa] merangkai pesan dari isian ── */
  document.querySelectorAll("form[data-wa]").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const intro = form.dataset.wa || "Halo, saya ingin bertanya.";
      const lines = [intro];
      form.querySelectorAll("input, select, textarea").forEach((f) => {
        if (f.name && f.value) lines.push(`${f.dataset.label || f.name}: ${f.value}`);
      });
      window.open("https://wa.me/6281226907008?text=" + encodeURIComponent(lines.join("\n")), "_blank", "noopener");
    });
  });

  /* ── 13. Spotlight kartu jurusan mengikuti kursor ── */
  if (!isTouch && !reduceMotion) {
    document.querySelectorAll(".jcard").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${e.clientX - r.left}px`);
        card.style.setProperty("--my", `${e.clientY - r.top}px`);
      });
    });
  }

  /* ── 14. Nav-link aktif mengikuti section terlihat ── */
  const sections = document.querySelectorAll("section[id]");
  const navLinks = [...document.querySelectorAll(".nav-link")];
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((l) =>
            l.classList.toggle("is-active", l.getAttribute("href") === `#${entry.target.id}`)
          );
        }
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  sections.forEach((s) => sectionObserver.observe(s));
})();
