/* ============ KONFIGURASI — edit di sini ============ */
const weddingConfig = {
  bride: "Mawarda Sholeha",
  groom: "Arjun Nur Alfantori",
  date: "7 November 2026",
  akadTime: "08.00 WIB",
  receptionTime: "10.00 WIB",
  whatsapp: "6282183646481",          // format internasional tanpa +, contoh: 6281234567890
  mapsUrl: "",                     // kosongkan = otomatis dari alamat. Atau isi link Google Maps sendiri.
  address: "Jl. Aru Jajar, Perumahan Puri Bandara Blok A No. 16, RT. 08 RW. 03, Kelurahan Pekan Sabtu, Kecamatan Selebar, Kota Bengkulu",
  addressHtml: "Jl. Aru Jajar, Perumahan Puri Bandara<br>Blok A No. 16, RT. 08 RW. 03<br>Kelurahan Pekan Sabtu, Kecamatan Selebar<br>Kota Bengkulu",
  eventStartISO: "2026-11-07T08:00:00+07:00",
  rsvpEndpoint: "https://script.google.com/macros/s/AKfycbzNt7qNy8G4m9GJNKaA8WiY4ossKtwugq_CwGV9wQ50B1cgHhsXMZoreTT6hvmN6S3Mfw/exec"                 // URL Google Apps Script / Firebase function. Kosong = mode demo (localStorage)
};

/* ============ Helper ============ */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const toast = (msg) => { const t = $("#toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove("show"), 2600); };
const esc = (s) => s.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const mapsLink = weddingConfig.mapsUrl || "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(weddingConfig.address);

/* ============ Isi alamat & link maps ============ */
["addr1", "addr2", "addr3"].forEach(id => { $("#" + id).innerHTML = weddingConfig.addressHtml; });
$$("[data-maps]").forEach(a => a.href = mapsLink);
$("#mapFrame").src = "https://www.google.com/maps?q=" + encodeURIComponent(weddingConfig.address) + "&output=embed";
const waText = "Halo Mawar & Arjun, saya ingin mengonfirmasi kehadiran untuk acara pernikahan tanggal 7 November 2026.";
$("#waBtn").href = "https://wa.me/" + weddingConfig.whatsapp + "?text=" + encodeURIComponent(waText);
$("#waBtn").addEventListener("click", e => { if (weddingConfig.whatsapp === "ISI_NOMOR") { e.preventDefault(); toast("Nomor WhatsApp belum diisi di script.js"); } });

/* ============ Cover & musik ============ */
const audio = $("#audio"), music = $("#music");
function setMusicUI(on) { music.classList.toggle("playing", on); $("#musicStatus").textContent = on ? "Playing" : "Paused"; }
audio.volume = .6;
$("#openBtn").addEventListener("click", () => {
  $("#envelope").classList.add("opened");
  $("#openBtn").disabled = true;
  audio.play().then(() => setMusicUI(true)).catch(() => setMusicUI(false));
  music.hidden = false;
  const heroRv = $$("#hero .rv");
  heroRv.forEach(el => el.classList.remove("in"));   // disembunyikan dulu, dimunculkan saat cover larut
  if (!reduce) {
    const f = document.createElement("div"); f.className = "bloom"; document.body.appendChild(f);
    setTimeout(() => f.remove(), 4200);
    setTimeout(() => petalBurst(innerWidth / 2, innerHeight * .55, 46), 2200);
    setTimeout(petalAmbient, 2800);
  }
  setTimeout(() => { $("#cover").classList.add("gone"); document.body.classList.remove("locked"); window.scrollTo(0, 0); }, reduce ? 300 : 2200);
  setTimeout(() => heroRv.forEach(el => el.classList.add("in")), reduce ? 400 : 2300);
  autoBtn.hidden = false;
  if (!reduce) autoTimer = setTimeout(() => { autoTimer = 0; autoStart(true); }, 6500);
});
$("#musicBtn").addEventListener("click", () => { if (audio.paused) audio.play().then(() => setMusicUI(true)).catch(() => toast("File musik belum ditemukan di /audio")); else { audio.pause(); setMusicUI(false); } });
$("#muteBtn").addEventListener("click", e => { audio.muted = !audio.muted; e.currentTarget.textContent = audio.muted ? "🔇" : "🔊"; });
$("#vol").addEventListener("input", e => { audio.volume = e.target.value; });

/* ============ Reveal saat scroll ============ */
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .15 });
const observe = () => $$(".rv:not(.in),.line:not(.in),.ph:not(.in),.gi:not(.in)").forEach(el => io.observe(el));

/* ============ Galeri + lightbox (15 foto) ============ */
const photos = Array.from({ length: 15 }, (_, i) => `images/${String(i + 1).padStart(2, "0")}.jpg`);
const grid = $("#galleryGrid");
photos.forEach((src, i) => {
  const b = document.createElement("button");
  b.className = "gi"; b.setAttribute("aria-label", "Buka foto " + (i + 1));
  b.innerHTML = `<img src="${src}" alt="Foto galeri Mawar dan Arjun ${i + 1}" loading="lazy" decoding="async">`;
  b.firstChild.onerror = function () { this.remove(); };
  b.addEventListener("click", () => openLB(i));
  grid.appendChild(b);
});
const lb = $("#lb"), lbImg = $("#lbImg"); let cur = 0;
function showLB(i) { cur = (i + photos.length) % photos.length; lbImg.style.opacity = 0; setTimeout(() => { lbImg.src = photos[cur]; lbImg.alt = "Foto galeri " + (cur + 1); lbImg.style.opacity = 1; }, 200); }
function openLB(i) { lb.hidden = false; requestAnimationFrame(() => lb.classList.add("show")); lbImg.src = photos[i]; cur = i; document.body.classList.add("locked"); $("#lbX").focus(); }
function closeLB() { lb.classList.remove("show"); setTimeout(() => { lb.hidden = true; document.body.classList.remove("locked"); }, 450); }
$("#lbX").onclick = closeLB; $("#lbP").onclick = () => showLB(cur - 1); $("#lbN").onclick = () => showLB(cur + 1);
lb.addEventListener("click", e => { if (e.target === lb) closeLB(); });
document.addEventListener("keydown", e => { if (lb.hidden) return; if (e.key === "Escape") closeLB(); if (e.key === "ArrowLeft") showLB(cur - 1); if (e.key === "ArrowRight") showLB(cur + 1); });
let sx = 0;
lb.addEventListener("touchstart", e => { sx = e.touches[0].clientX; }, { passive: true });
lb.addEventListener("touchend", e => { const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) showLB(cur + (dx < 0 ? 1 : -1)); }, { passive: true });

/* ============ Countdown ============ */
const target = new Date(weddingConfig.eventStartISO).getTime();
function tick() {
  const d = target - Date.now();
  if (d <= 0) { $("#cd").hidden = true; $("#arrived").hidden = false; return; }
  const p = n => String(n).padStart(2, "0");
  $("#cdD").textContent = p(Math.floor(d / 864e5)); $("#cdH").textContent = p(Math.floor(d % 864e5 / 36e5));
  $("#cdM").textContent = p(Math.floor(d % 36e5 / 6e4)); $("#cdS").textContent = p(Math.floor(d % 6e4 / 1e3));
}
tick(); setInterval(tick, 1000);

/* ============ Add to calendar (.ics) ============ */
$("#calBtn").addEventListener("click", () => {
  const ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Undangan Mawar Arjun//ID", "BEGIN:VEVENT",
    "UID:arjun-mawarda-20261107@undangan", "DTSTAMP:20260101T000000Z",
    "DTSTART:20261107T010000Z", "DTEND:20261107T060000Z",   // 08.00–13.00 WIB
    "SUMMARY:Pernikahan Mawar & Arjun", "DESCRIPTION:Akad 08.00 WIB - Resepsi 10.00 WIB",
    "LOCATION:" + weddingConfig.address.replace(/,/g, "\\,"), "END:VEVENT", "END:VCALENDAR"].join("\r\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar" })); a.download = "pernikahan-arjun-mawarda.ics";
  a.click(); toast("Event kalender diunduh.");
});

/* ============ Salin rekening ============ */
$$("[data-copy]").forEach(b => b.addEventListener("click", async () => {
  const v = b.dataset.copy;
  try { await navigator.clipboard.writeText(v); }
  catch { const t = document.createElement("textarea"); t.value = v; document.body.appendChild(t); t.select(); document.execCommand("copy"); t.remove(); }
  toast("Nomor rekening berhasil disalin.");
}));

/* ============ RSVP & Ucapan ============ */
async function submitData(type, payload) {
  // Hubungkan ke Google Sheets (Apps Script) lewat weddingConfig.rsvpEndpoint.
  if (weddingConfig.rsvpEndpoint) {
    await fetch(weddingConfig.rsvpEndpoint, { method: "POST", mode: "no-cors", keepalive: true, headers: { "Content-Type": "text/plain" }, body: JSON.stringify({ type, ...payload, at: new Date().toISOString() }) });
  } else {
    const k = "undangan_" + type; const arr = JSON.parse(localStorage.getItem(k) || "[]"); arr.push(payload); localStorage.setItem(k, JSON.stringify(arr));
  }
}

// Kunci tombol kirim sebentar supaya tidak terkirim dobel kalau diklik berkali-kali
function lockSubmit(form, ms = 4000) {
  const btn = form.querySelector('[type="submit"]') || form.querySelector("button");
  const label = btn ? btn.textContent : "";
  if (btn) { btn.disabled = true; btn.textContent = "Mengirim..."; }
  form.dataset.busy = "1";
  setTimeout(() => { delete form.dataset.busy; if (btn) { btn.disabled = false; btn.textContent = label; } }, ms);
}

$("#rsvpForm").addEventListener("submit", e => {
  e.preventDefault();
  const f = e.target;
  if (f.dataset.busy) return;
  const d = Object.fromEntries(new FormData(f));
  if (!(d.name || "").trim()) { toast("Nama wajib diisi."); f.name.focus(); return; }
  lockSubmit(f);
  f.reset();
   toast("Terima kasih, konfirmasi Anda terkirim.");
  petalBurst(innerWidth / 2, innerHeight * .7, 26);
  submitData("rsvp", d).catch(() => toast("Gagal mengirim. Coba lagi."));
});

// Contoh ucapan bawaan. Kosongkan array ini ([]) kalau tidak ingin ditampilkan.
const defaultWishes = [
  { name: "Keluarga Besar", text: "Selamat menempuh hidup baru. Semoga sakinah, mawaddah, warahmah." },
  { name: "Sahabat", text: "Bahagia selalu untuk kalian berdua. Semoga setiap langkah dipenuhi berkah." },
  { name: "Rekan Kerja", text: "Barakallahu lakuma wa baraka alaikuma wa jama'a bainakuma fii khair." }
];
let wishes = [...defaultWishes];
function renderWishes() { $("#wishList").innerHTML = wishes.map(w => `<article class="wish"><h4>${esc(w.name)}</h4><p>${esc(w.text)}</p></article>`).join(""); }
renderWishes();

// Muat ucapan dari Google Sheets saat halaman dibuka (supaya tidak hilang setelah refresh)
async function loadWishes() {
  if (!weddingConfig.rsvpEndpoint) {
    try { wishes = [...JSON.parse(localStorage.getItem("undangan_wish") || "[]").reverse(), ...defaultWishes]; renderWishes(); } catch { }
    return;
  }
  try {
    const r = await fetch(weddingConfig.rsvpEndpoint);
    const j = await r.json();
    if (j.ok && Array.isArray(j.wishes) && j.wishes.length) { wishes = [...j.wishes, ...defaultWishes]; renderWishes(); }
  } catch { /* gagal muat: tetap tampilkan ucapan bawaan */ }
}
loadWishes();

$("#wishForm").addEventListener("submit", e => {
  e.preventDefault();
  const f = e.target;
  if (f.dataset.busy) return;
  const d = Object.fromEntries(new FormData(f));
  d.name = (d.name || "").trim(); d.text = (d.text || "").trim();
  if (!d.name || !d.text) { toast("Nama dan ucapan wajib diisi."); return; }
  lockSubmit(f);
  // Tampil langsung, kirim ke sheet di latar belakang (tidak perlu menunggu server)
  wishes.unshift(d); renderWishes(); f.reset();
  toast("Ucapan Anda terkirim. Terima kasih.");
  petalBurst(innerWidth / 2, innerHeight * .7, 26);
  submitData("wish", d).catch(() => { wishes = wishes.filter(w => w !== d); renderWishes(); toast("Gagal mengirim. Coba lagi."); });
});

/* ============ Ripple ============ */
document.addEventListener("click", e => {
  const b = e.target.closest(".btn"); if (!b || reduce) return;
  const r = b.getBoundingClientRect(), s = Math.max(r.width, r.height) * 2, i = document.createElement("span");
  i.className = "rip"; i.style.cssText = `width:${s}px;height:${s}px;left:${e.clientX - r.left - s / 2}px;top:${e.clientY - r.top - s / 2}px`;
  b.appendChild(i); setTimeout(() => i.remove(), 700);
});

/* ============ Scroll: progress + parallax ============ */
const pxEls = $$(".px"); let ticking = false;
function onScroll() {
  const h = document.documentElement; $("#progress").style.transform = `scaleX(${h.scrollTop / (h.scrollHeight - h.clientHeight || 1)})`;
  if (!reduce) pxEls.forEach(el => { const r = el.parentElement.getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight) return; el.firstElementChild && (el.firstElementChild.style.transform = `translate3d(0,${(r.top - innerHeight / 2) * -.12}px,0) scale(1.1)`); });
  ticking = false;
}
addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });

/* ============ Debu halus ============ */
(function dust() {
  if (reduce) return;
  const c = $("#dust"), x = c.getContext("2d"); let w, h; const n = innerWidth < 700 ? 22 : 40;
  const size = () => { w = c.width = innerWidth; h = c.height = innerHeight; }; size(); addEventListener("resize", size);
  const p = Array.from({ length: n }, () => ({ x: Math.random() * w, y: Math.random() * h, r: Math.random() * 1.4 + .3, v: Math.random() * .25 + .08, a: Math.random() * .4 + .15 }));
  (function loop() {
    x.clearRect(0, 0, w, h);
    p.forEach(q => { q.y -= q.v; q.x += Math.sin(q.y / 60) * .15; if (q.y < -4) { q.y = h + 4; q.x = Math.random() * w; } x.fillStyle = `rgba(245,190,205,${q.a})`; x.beginPath(); x.arc(q.x, q.y, q.r, 0, 6.28); x.fill(); });
    requestAnimationFrame(loop);
  })();
})();

/* ============ Kutipan muncul kata demi kata ============ */
$$(".serif-q,.quote,.intro-names,.sign,.muted.center").forEach(el => {
  let i = 0;
  [...el.childNodes].forEach(c => {
    if (c.nodeType !== 3) return;
    const frag = document.createDocumentFragment();
    c.textContent.split(/(\s+)/).forEach(w => {
      if (!w.trim()) { frag.append(w); return; }
      const s = document.createElement("span");
      s.className = "w"; s.textContent = w; s.style.transitionDelay = Math.min(i++ * .09, 3) + "s";
      frag.append(s);
    });
    c.replaceWith(frag);
  });
});

/* ============ Kelopak mawar ============ */
let petals = [], pctx, pw, ph, pRun = false;
const PCOL = ["#f6b8c6", "#ee8fa6", "#e4708e", "#f9d3dc", "#d95b7c"];
function petalInit() {
  if (pctx || reduce) return;
  const c = document.createElement("canvas"); c.id = "petals"; c.setAttribute("aria-hidden", "true"); document.body.appendChild(c);
  pctx = c.getContext("2d");
  const size = () => { pw = c.width = innerWidth; ph = c.height = innerHeight; }; size(); addEventListener("resize", size);
}
function newPetal(x, y, o = {}) {
  return Object.assign({ x, y, s: Math.random() * 6 + 6, rot: Math.random() * 6.28, vr: (Math.random() - .5) * .03, t: Math.random() * 6.28, vt: Math.random() * .03 + .01, base: Math.random() * .7 + .5, vx: 0, vy: 0, col: PCOL[Math.random() * PCOL.length | 0], a: Math.random() * .35 + .5, burst: false }, o);
}
function drawPetal(p) {
  const c = pctx, s = p.s;
  c.save(); c.translate(p.x, p.y); c.rotate(p.rot); c.scale(1, Math.cos(p.t * 1.7)); c.globalAlpha = p.a; c.fillStyle = p.col;
  c.beginPath(); c.moveTo(0, -s); c.bezierCurveTo(s * .9, -s * .6, s * .8, s * .7, 0, s); c.bezierCurveTo(-s * .8, s * .7, -s * .9, -s * .6, 0, -s); c.fill(); c.restore();
}
function petalLoop() {
  pctx.clearRect(0, 0, pw, ph);
  petals = petals.filter(p => {
    p.t += p.vt; p.rot += p.vr;
    p.vx *= .985; p.vy += (p.base - p.vy) * .03;      // ledakan melambat lalu jatuh pelan
    p.x += p.vx + Math.sin(p.t) * .6; p.y += p.vy;
    if (p.y > ph + 20 || p.x < -40 || p.x > pw + 40) {
      if (p.burst) return false;
      p.y = -20; p.x = Math.random() * pw; p.vx = 0; p.vy = p.base;
    }
    drawPetal(p); return true;
  });
  if (petals.length) requestAnimationFrame(petalLoop); else pRun = false;
}
function petalStart() { if (!pRun) { pRun = true; requestAnimationFrame(petalLoop); } }
function petalBurst(x, y, n = 30) {
  petalInit(); if (!pctx) return;
  for (let i = 0; i < n; i++) {
    const ang = -Math.PI / 2 + (Math.random() - .5) * 2.6, sp = Math.random() * 9 + 3;
    petals.push(newPetal(x, y, { vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp, burst: true }));
  }
  petalStart();
}
function petalAmbient() {
  petalInit(); if (!pctx) return;
  const n = innerWidth < 700 ? 12 : 20;
  for (let i = 0; i < n; i++) petals.push(newPetal(Math.random() * pw, -Math.random() * ph));
  petalStart();
}

/* ============ Gulir otomatis (bisa diambil alih manual) ============ */
const autoBtn = $("#autoBtn");
const AUTO_SPEED = 40;                      // piksel per detik, naikkan kalau mau lebih cepat
let autoOn = false, autoPos = 0, autoLast = 0, autoRaf = 0, autoTimer = 0;
function setAutoUI(on) {
  autoOn = on;
  document.body.classList.toggle("autoing", on);
  autoBtn.classList.toggle("on", on);
  autoBtn.setAttribute("aria-pressed", on);
  autoBtn.firstElementChild.textContent = on ? "❚❚" : "▼";
  autoBtn.setAttribute("aria-label", on ? "Hentikan gulir otomatis" : "Mulai gulir otomatis");
}
function autoFrame(t) {
  if (!autoOn) return;
  const dt = Math.min((t - autoLast) / 1000, .1); autoLast = t;
  if (document.body.classList.contains("locked")) { autoPos = scrollY; autoRaf = requestAnimationFrame(autoFrame); return; }  // jeda saat lightbox terbuka
  if (Math.abs(scrollY - autoPos) > 3) { autoStop(); return; }   // tamu menggulir sendiri
  autoPos += AUTO_SPEED * dt;
  const max = document.documentElement.scrollHeight - innerHeight;
  if (autoPos >= max - 1) { scrollTo({ top: max, behavior: "instant" }); autoStop(); return; }
  scrollTo({ top: autoPos, behavior: "instant" });
  autoRaf = requestAnimationFrame(autoFrame);
}
function autoStart(hint) {
  cancelAnimationFrame(autoRaf); clearTimeout(autoTimer); autoTimer = 0;
  autoPos = scrollY; autoLast = performance.now();
  setAutoUI(true);
  autoRaf = requestAnimationFrame(autoFrame);
  if (hint) toast("Gulir otomatis aktif. Sentuh layar untuk mengambil alih.");
}
function autoStop() {
  cancelAnimationFrame(autoRaf); clearTimeout(autoTimer); autoTimer = 0;
  setAutoUI(false);
}
autoBtn.addEventListener("click", () => {
  if (autoOn) { autoStop(); return; }
  const max = document.documentElement.scrollHeight - innerHeight;
  if (scrollY >= max - 5) scrollTo({ top: 0, behavior: "instant" });   // sudah di bawah: ulang dari atas
  autoStart();
});
// Interaksi manual apa pun menghentikan gulir otomatis (kecuali menekan tombolnya sendiri)
["wheel", "touchstart", "keydown"].forEach(ev => addEventListener(ev, e => {
  if (e.target.closest && e.target.closest("#autoBtn")) return;
  if (autoOn || autoTimer) autoStop();
}, { passive: true }));
addEventListener("pointerdown", e => {
  if (e.target.closest && e.target.closest("#autoBtn")) return;
  if (e.pointerType === "mouse" && e.clientX >= document.documentElement.clientWidth && (autoOn || autoTimer)) autoStop();   // tarik scrollbar
});
document.addEventListener("focusin", e => { if (e.target.matches("input,textarea,select") && (autoOn || autoTimer)) autoStop(); });

/* ============ Transisi tiap bagian ============ */
// 1) arah masuk bergantian
const fx = (sel, type) => $$(sel).forEach(el => { el.dataset.fx = type; });
fx(".person:nth-child(odd)", "left");  fx(".person:nth-child(even)", "right");
fx(".event:nth-child(odd)", "left");   fx(".event:nth-child(even)", "right");
fx(".gift:nth-child(odd)", "left");    fx(".gift:nth-child(even)", "right");
fx(".daydate", "zoom"); fx("#save .big", "zoom"); fx("#save .date", "zoom");

// 2) judul per huruf
$$(".head").forEach(el => {
  const t = el.textContent; el.setAttribute("aria-label", t); el.textContent = "";
  [...t].forEach((ch, i) => {
    if (ch === " ") { el.append(" "); return; }
    const s = document.createElement("span");
    s.className = "ch"; s.setAttribute("aria-hidden", "true"); s.textContent = ch;
    s.style.transitionDelay = (.15 + i * .06) + "s";
    el.append(s);
  });
});

// 3) penanda hati di awal tiap bagian
$$(".sec").forEach(s => {
  const o = document.createElement("div");
  o.className = "orn"; o.setAttribute("aria-hidden", "true");
  o.innerHTML = '<i></i><b><svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg></b><i></i>';
  s.prepend(o); io.observe(o);
});

// 4) galeri berurutan & countdown
$$(".gi").forEach((g, i) => g.style.setProperty("--gd", (i % 4) * .12 + "s"));
$("#cd").classList.add("rv");

// 5) teks hero bergeser pelan & memudar saat digulir
const heroIn = $(".hero-in");
if (!reduce) addEventListener("scroll", () => {
  const y = scrollY, h = innerHeight;
  if (y < h) { heroIn.style.transform = `translateY(${y * .25}px)`; heroIn.style.opacity = Math.max(0, 1 - y / (h * .7)); }
}, { passive: true });

observe(); onScroll();
