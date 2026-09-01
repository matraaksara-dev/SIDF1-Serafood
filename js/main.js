/* ============================================================
   PT SERA FOOD — Ringkasan Investasi · main.js
   Semua data bersumber dari dokumen SIDF Level 1 (indikatif).
   Tanpa dependensi eksternal (CDN). Chart di-render via SVG.
   ============================================================ */
(function () {
  "use strict";

  /* ---------- util ---------- */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const SVGNS = "http://www.w3.org/2000/svg";
  const fmt = (n, d = 1) => n.toLocaleString("id-ID", { minimumFractionDigits: d, maximumFractionDigits: d });
  const svgEl = (tag, attrs) => {
    const e = document.createElementNS(SVGNS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    return e;
  };
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ============================================================
     DATA
     ============================================================ */
  const SNAPSHOT = [
    ["Jenis Investasi", "Expansion Project — Pendanaan Perbankan"],
    ["Nilai Kredit / Pokok", "Rp134 Miliar (est., TBD bank — L2)"],
    ["Kapasitas Eksisting", "±1 ton/jam"],
    ["Penambahan Mesin", "1 unit × 2 ton/jam (baru)"],
    ["Target Kapasitas", "±3 ton/jam"],
    ["Grace Period", "2 Tahun (2027–2028)"],
    ["Tenor Kredit", "15 Tahun"],
    ["Mulai Cicilan", "2029"],
    ["Suku Bunga", "6,5% flat/tahun (est.)"],
    ["Skema Pembayaran", "Flat (pokok + bunga tetap)"],
    ["Struktur Return", "Cicilan ke Bank (bukan bagi hasil)"],
    ["Net Profit Margin", "12% tetap sepanjang tenor"],
    ["Revenue Awal Cicilan (2029)", "Rp192,3 Miliar"],
    ["Revenue Akhir Tenor (2043)", "Rp724,0 Miliar"]
  ];

  const BASELINE = [
    ["Penjualan (8 bln)", "Rp119,1 M"],
    ["Pendapatan Usaha", "Rp117,5 M"],
    ["Laba Kotor", "Rp27,0 M"],
    ["Laba Usaha", "Rp16,4 M"],
    ["Laba Bersih", "Rp15,0 M"],
    ["NPM Aktual", "12,80%"]
  ];

  const TUJUAN = [
    ["Meningkatkan Kapasitas Produksi", "Dari ±1 ton/jam menjadi ±3 ton/jam melalui 1 unit mesin baru 2 ton/jam."],
    ["Pengembangan Fasilitas Produksi", "Mesin, peralatan pendukung, fasilitas proses, dan utilitas operasional."],
    ["Penguatan Infrastruktur Penyimpanan", "Kapasitas cold chain untuk menjaga kualitas produk beku."],
    ["Penguatan Distribusi & Supply Chain", "Sistem distribusi, jaringan pemasaran, dan ketersediaan bahan baku."],
    ["Penyediaan Modal Pendukung Operasional", "Bahan baku, persediaan, dan kas operasional selama fase pertumbuhan."]
  ];

  const PARAMS = [
    ["Rp134 M", "Nilai Kredit"],
    ["15 Tahun", "Tenor Kredit"],
    ["2 Tahun", "Grace Period (2027–2028)"],
    ["6,5% flat", "Suku Bunga"],
    ["2029", "Mulai Cicilan"],
    ["Rp19,0 M", "Cicilan Tahunan (flat)"]
  ];

  const TIMELINE = [
    ["2027 — Grace I", "Realisasi Investasi", "Pengadaan 1 unit mesin baru (2 ton/jam). Belum ada kewajiban cicilan."],
    ["2028 — Grace II", "Produktif Pertama", "Instalasi selesai, mulai produktif. Utilisasi awal ±45%."],
    ["2029–2032", "Repayment & Growth", "Cicilan Rp19,0 M/th. Utilisasi 60% → 72%. DSCR 1,21x → 1,61x."],
    ["2033–2043", "Maturity", "Utilisasi 75% → 87%. DSCR menembus 4,57x."]
  ];

  const PROJ = [
    { y: 2025, cap: 1, g: 0.00,  rev: 176.3, np: 21.2, cic: null, dscr: null, note: "Baseline (8 bln)" },
    { y: 2026, cap: 1, g: 13.64, rev: 200.3, np: 24.0, cic: null, dscr: null, note: "Pre-investasi" },
    { y: 2027, cap: 1, g: 0.00,  rev: 200.3, np: 24.0, cic: null, dscr: null, note: "Grace I" },
    { y: 2028, cap: 3, g: -12.50, rev: 175.3, np: 21.0, cic: null, dscr: null, note: "Grace II" },
    { y: 2029, cap: 3, g: 9.71,  rev: 192.3, np: 23.1, cic: 19.0, dscr: 1.21, note: "Mulai cicilan" },
    { y: 2030, cap: 3, g: 9.90,  rev: 211.3, np: 25.4, cic: 19.0, dscr: 1.33 },
    { y: 2031, cap: 3, g: 9.95,  rev: 232.3, np: 27.9, cic: 19.0, dscr: 1.47 },
    { y: 2032, cap: 3, g: 9.91,  rev: 255.4, np: 30.6, cic: 19.0, dscr: 1.61, note: "Util ~75%" },
    { y: 2033, cap: 3, g: 9.89,  rev: 280.6, np: 33.7, cic: 19.0, dscr: 1.77 },
    { y: 2034, cap: 3, g: 9.96,  rev: 308.6, np: 37.0, cic: 19.0, dscr: 1.95 },
    { y: 2035, cap: 3, g: 10.03, rev: 339.5, np: 40.7, cic: 19.0, dscr: 2.14 },
    { y: 2036, cap: 3, g: 10.00, rev: 373.5, np: 44.8, cic: 19.0, dscr: 2.36 },
    { y: 2037, cap: 3, g: 9.89,  rev: 410.4, np: 49.2, cic: 19.0, dscr: 2.59, note: "Util ~80%" },
    { y: 2038, cap: 3, g: 9.98,  rev: 451.4, np: 54.2, cic: 19.0, dscr: 2.85 },
    { y: 2039, cap: 3, g: 9.96,  rev: 496.3, np: 59.6, cic: 19.0, dscr: 3.13 },
    { y: 2040, cap: 3, g: 10.06, rev: 546.2, np: 65.5, cic: 19.0, dscr: 3.45 },
    { y: 2041, cap: 3, g: 10.05, rev: 601.1, np: 72.1, cic: 19.0, dscr: 3.79 },
    { y: 2042, cap: 3, g: 9.97,  rev: 661.1, np: 79.3, cic: 19.0, dscr: 4.17, note: "Util ~80%" },
    { y: 2043, cap: 3, g: 9.52,  rev: 724.0, np: 86.9, cic: 19.0, dscr: 4.57, note: "Akhir tenor" }
  ];

  const SENS = {
    A: { title: "Sensitivitas Net Profit 2029 (Revenue Rp192,3 M)", head: ["NPM", "Net Profit 2029 (Rp M)"],
         rows: [["10%", "19,2"], ["12% (base)", "23,1"], ["13%", "25,0"], ["15%", "28,8"]] },
    B: { title: "Sensitivitas Net Profit 2043 (Revenue Rp724,0 M)", head: ["NPM", "Net Profit 2043 (Rp M)"],
         rows: [["10%", "72,4"], ["12% (base)", "86,9"], ["13%", "94,1"], ["15%", "108,6"]] },
    C: { title: "Sensitivitas Revenue terhadap Utilisasi (2043)", head: ["Util. %", "Produktivitas (Ton/Thn)", "Revenue (Rp M)", "Net Profit 12% (Rp M)"],
         rows: [["70%", "11.592", "579,6", "69,6"], ["80%", "13.248", "662,4", "79,5"], ["87% (base)", "14.407", "720,4", "86,4"], ["95%", "15.732", "786,6", "94,4"]] },
    D: { title: "DSCR Tahun per Tahun (2029–2043)", head: ["Tahun", "Net Profit (Rp M)", "Cicilan (Rp M)", "DSCR", "Status"],
         rows: PROJ.filter(p => p.dscr).map(p => [String(p.y), fmt(p.np, 1), fmt(p.cic, 1), fmt(p.dscr, 2) + "x", "Sehat"]) }
  };

  const ASSUMP = [
    ["Kapasitas Mesin Existing", "1 ton/jam"],
    ["Kapasitas Mesin Baru (2027)", "2 ton/jam"],
    ["Total Kapasitas Pasca-Investasi", "3 ton/jam"],
    ["Jam Kerja Mesin", "20 jam/hari"],
    ["Hari Kerja", "23 hari/bulan"],
    ["Produktivitas Tahunan (Full)", "16.560 ton/tahun"],
    ["Harga Jual Rata-rata", "Rp50.000.000/ton"],
    ["Revenue Maks Teoritis", "Rp828 Miliar/tahun"],
    ["NPM (tetap)", "12% (vs aktual 12,8%)"],
    ["Nilai Kredit / Pokok", "Rp134 Miliar (TBD bank)"],
    ["Suku Bunga (flat)", "6,5%/tahun (TBD bank)"],
    ["Tenor / Grace", "15 thn / 2 thn"],
    ["Cicilan Pokok + Bunga", "Rp10,3 M + Rp8,7 M = Rp19,0 M"],
    ["Mulai Cicilan", "2029"],
    ["Utilisasi 2029 → 2043", "60% → 87%"],
    ["CAGR Net Profit (2029–43)", "±9,9%/tahun"]
  ];

  const RISKS = [
    ["Fluktuasi harga bahan baku ayam", "Penurunan margin keuntungan", "Kontrak jangka panjang & diversifikasi pemasok", "Tinggi", "danger"],
    ["Persaingan industri frozen food", "Tekanan harga & pangsa pasar", "Diferensiasi produk, kualitas, distribusi", "Sedang", "warn"],
    ["DSCR awal tenor rendah (1,21x '29)", "Ruang bunga tipis di awal", "Akselerasi utilisasi, konfirmasi bank, buffer kas", "Sedang", "warn"],
    ["Gangguan rantai pasok (supply chain)", "Keterlambatan produksi", "Diversifikasi pemasok & manajemen persediaan", "Tinggi", "danger"],
    ["Perubahan regulasi pangan", "Penyesuaian operasional", "Pemantauan regulasi & kepatuhan standar", "Rendah", "ok"]
  ];

  const CHECKLIST = [
    "Konfirmasi nilai kredit & suku bunga final dari bank",
    "Penyusunan financial model final",
    "Perhitungan DSCR secara presisi",
    "Rekonsiliasi jadwal amortisasi (pokok lunas 2041 vs cicilan 2043)",
    "Analisis sensitivitas & skenario (termasuk stress test pesimis)"
  ];

  /* ============================================================
     RENDER · static tables / lists
     ============================================================ */
  function kvRender(id, rows) {
    const node = $(id);
    if (!node) return;
    node.innerHTML = rows.map(([k, v]) =>
      `<div class="kv__row"><span class="kv__k">${k}</span><span class="kv__v">${v}</span></div>`).join("");
  }
  kvRender("#snapshot", SNAPSHOT);
  kvRender("#baseline", BASELINE);
  kvRender("#assump", ASSUMP);

  // Tujuan
  $("#tujuanList").innerHTML = TUJUAN.map(([t, d]) =>
    `<li><div><h4>${t}</h4><p>${d}</p></div></li>`).join("");

  // Param grid
  $("#paramGrid").innerHTML = PARAMS.map(([v, k]) =>
    `<div class="param"><b>${v}</b><span>${k}</span></div>`).join("");

  // Timeline
  $("#timeline").innerHTML = TIMELINE.map(([yr, h, p]) =>
    `<div class="tl"><div class="tl__yr">${yr}</div><h4>${h}</h4><p>${p}</p></div>`).join("");

  // Risks
  $("#riskBody").innerHTML = RISKS.map(([r, d, m, lvl, cls]) =>
    `<tr><td>${r}</td><td>${d}</td><td>${m}</td><td><span class="chip chip--${cls}">${lvl}</span></td></tr>`).join("");

  // Checklist
  $("#checkList").innerHTML = CHECKLIST.map(c => `<li>${c}</li>`).join("");

  // Projection table
  const projBody = $("#projTable tbody");
  function renderProj(mode) {
    const subset = mode === "brief"
      ? PROJ.filter(p => [2025, 2028, 2029, 2032, 2036, 2040, 2043].includes(p.y))
      : PROJ;
    projBody.innerHTML = subset.map(p => {
      const sisa = p.cic ? (p.np - p.cic) : "–";
      return `<tr>
        <td>${p.y}</td>
        <td>${p.cap}</td>
        <td>${p.g > 0 ? "+" : ""}${fmt(p.g, 2)}%</td>
        <td>${fmt(p.rev, 1)}</td>
        <td>${p.npm || 12}%</td>
        <td>${fmt(p.np, 1)}</td>
        <td>${p.cic ? fmt(p.cic, 1) : "–"}</td>
        <td>${sisa !== "–" ? fmt(sisa, 1) : "–"}</td>
        <td>${p.dscr ? fmt(p.dscr, 2) + "x" : "n/a"}</td>
      </tr>`;
    }).join("");
  }
  renderProj("full");

  $$(".toggle__btn").forEach(btn => btn.addEventListener("click", () => {
    $$(".toggle__btn").forEach(b => { b.classList.remove("is-active"); b.setAttribute("aria-pressed", "false"); });
    btn.classList.add("is-active"); btn.setAttribute("aria-pressed", "true");
    renderProj(btn.dataset.mode);
  }));

  // Sensitivity tabs
  function renderSens(key) {
    const s = SENS[key];
    const body = $("#sensBody");
    body.innerHTML = `<p class="panel__sub" style="margin:0 0 12px">${s.title}</p>
      <div class="table-wrap"><table class="data-table"><thead><tr>${s.head.map(h => `<th>${h}</th>`).join("")}</tr></thead>
      <tbody>${s.rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
  }
  renderSens("A");
  $$("#sensTabs .tab").forEach(tab => tab.addEventListener("click", () => {
    $$("#sensTabs .tab").forEach(t => { t.classList.remove("is-active"); t.setAttribute("aria-selected", "false"); });
    tab.classList.add("is-active"); tab.setAttribute("aria-selected", "true");
    renderSens(tab.dataset.tab);
  }));

  /* ============================================================
     CHARTS (SVG, hand-built)
     ============================================================ */
  const COL = { red: "#B22222", redDark: "#8B1A1A", ink: "#1F1F1F", grid: "#e3e0d8", text: "#6b6b6b", ok: "#2e7d32" };

  function axisText(x, y, str, anchor = "middle", size = 11, color = COL.text) {
    const t = svgEl("text", { x, y, "text-anchor": anchor, "font-size": size, fill: color, "font-family": "Segoe UI, system-ui, sans-serif" });
    t.textContent = str;
    return t;
  }

  // ---- Chart 1: Revenue bars (2025–2043) ----
  function chartRevenue() {
    const W = 1000, H = 380, padL = 44, padB = 28, padT = 16;
    const plotW = W - padL - 10, plotH = H - padB - padT;
    const maxY = 800;
    const svg = svgEl("svg", { viewBox: `0 0 ${W} ${H}`, role: "img" });
    // gridlines
    [0, 200, 400, 600, 800].forEach(v => {
      const y = padT + plotH - (v / maxY) * plotH;
      svg.appendChild(svgEl("line", { x1: padL, y1: y, x2: W - 10, y2: y, stroke: COL.grid, "stroke-width": 1 }));
      svg.appendChild(axisText(padL - 6, y + 4, String(v), "end", 10));
    });
    const n = PROJ.length, slot = plotW / n, bw = slot * 0.62;
    PROJ.forEach((p, i) => {
      const x = padL + i * slot + (slot - bw) / 2;
      const h = (p.rev / maxY) * plotH;
      const y = padT + plotH - h;
      const rect = svgEl("rect", { x, y, width: bw, height: h, rx: 2, fill: COL.red, class: "bar" });
      rect.style.transitionDelay = (i * 28) + "ms";
      svg.appendChild(rect);
      svg.appendChild(axisText(padL + i * slot + slot / 2, H - 10, String(p.y), "middle", 9));
    });
    return svg;
  }

  // ---- Chart 2: Net Profit bars + Cicilan dashed line (2029–2043) ----
  function chartProfit() {
    const data = PROJ.filter(p => p.cic);
    const W = 1000, H = 340, padL = 44, padB = 28, padT = 16;
    const plotW = W - padL - 10, plotH = H - padB - padT;
    const maxY = 100;
    const svg = svgEl("svg", { viewBox: `0 0 ${W} ${H}`, role: "img" });
    [0, 25, 50, 75, 100].forEach(v => {
      const y = padT + plotH - (v / maxY) * plotH;
      svg.appendChild(svgEl("line", { x1: padL, y1: y, x2: W - 10, y2: y, stroke: COL.grid, "stroke-width": 1 }));
      svg.appendChild(axisText(padL - 6, y + 4, String(v), "end", 10));
    });
    const n = data.length, slot = plotW / n, bw = slot * 0.6;
    // cicilan line
    const cicY = padT + plotH - (19 / maxY) * plotH;
    svg.appendChild(svgEl("line", { x1: padL, y1: cicY, x2: W - 10, y2: cicY, stroke: COL.ink, "stroke-width": 2, "stroke-dasharray": "6 5" }));
    svg.appendChild(axisText(W - 14, cicY - 6, "Cicilan Rp19,0 M", "end", 10, COL.ink));
    data.forEach((p, i) => {
      const x = padL + i * slot + (slot - bw) / 2;
      const h = (p.np / maxY) * plotH;
      const y = padT + plotH - h;
      const rect = svgEl("rect", { x, y, width: bw, height: h, rx: 2, fill: COL.red, class: "bar" });
      rect.style.transitionDelay = (i * 32) + "ms";
      svg.appendChild(rect);
      svg.appendChild(axisText(padL + i * slot + slot / 2, H - 10, String(p.y), "middle", 9));
    });
    return svg;
  }

  // ---- Chart 3: DSCR line + threshold band ----
  function chartDSCR() {
    const data = PROJ.filter(p => p.dscr);
    const W = 1000, H = 360, padL = 44, padB = 28, padT = 16;
    const plotW = W - padL - 10, plotH = H - padB - padT;
    const maxY = 5;
    const svg = svgEl("svg", { viewBox: `0 0 ${W} ${H}`, role: "img" });
    // threshold band 1.1 - 1.2
    const y12 = padT + plotH - (1.2 / maxY) * plotH;
    const y11 = padT + plotH - (1.1 / maxY) * plotH;
    svg.appendChild(svgEl("rect", { x: padL, y: y12, width: plotW, height: (y11 - y12), fill: "#bdbdbd", opacity: .5 }));
    svg.appendChild(axisText(padL + 6, y12 - 4, "Ambang min. bank 1,1–1,2x", "start", 9.5, "#555"));
    [0, 1, 2, 3, 4, 5].forEach(v => {
      const y = padT + plotH - (v / maxY) * plotH;
      svg.appendChild(svgEl("line", { x1: padL, y1: y, x2: W - 10, y2: y, stroke: COL.grid, "stroke-width": 1 }));
      svg.appendChild(axisText(padL - 6, y + 4, String(v) + "x", "end", 10));
    });
    const n = data.length, slot = plotW / (n - 1);
    const xAt = i => padL + i * slot;
    const yAt = v => padT + plotH - (v / maxY) * plotH;
    // area under line
    let d = `M ${xAt(0)} ${yAt(data[0].dscr)}`;
    data.forEach((p, i) => { if (i) d += ` L ${xAt(i)} ${yAt(p.dscr)}`; });
    const area = d + ` L ${xAt(n - 1)} ${padT + plotH} L ${xAt(0)} ${padT + plotH} Z`;
    svg.appendChild(svgEl("path", { d: area, fill: COL.red, opacity: .08 }));
    // line
    const line = svgEl("path", { d, fill: "none", stroke: COL.red, "stroke-width": 2.5, "stroke-linejoin": "round", class: "line-path" });
    line.setAttribute("pathLength", "1");
    svg.appendChild(line);
    // dots + year labels
    data.forEach((p, i) => {
      svg.appendChild(svgEl("circle", { cx: xAt(i), cy: yAt(p.dscr), r: 3.2, fill: "#fff", stroke: COL.red, "stroke-width": 2, class: "dot" }));
      if (i % 2 === 0 || i === n - 1)
        svg.appendChild(axisText(xAt(i), H - 10, String(p.y), "middle", 9));
    });
    return svg;
  }

  function mountChart(id, buildFn) {
    const host = $(id);
    if (!host) return;
    host.appendChild(buildFn());
  }
  mountChart("#chartRevenue", chartRevenue);
  mountChart("#chartProfit", chartProfit);
  mountChart("#chartDSCR", chartDSCR);

  /* ============================================================
     COUNTERS
     ============================================================ */
  function animateCount(el) {
    const target = parseFloat(el.dataset.count);
    const prefix = el.dataset.prefix || "";
    const suffix = el.dataset.suffix || "";
    const dur = 1100;
    if (prefersReduced) { el.textContent = prefix + fmt(target, 0) + suffix; return; }
    const start = performance.now();
    function tick(now) {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = prefix + fmt(Math.round(target * eased), 0) + suffix;
      if (t < 1) requestAnimationFrame(tick);
      else el.textContent = prefix + fmt(target, 0) + suffix;
    }
    requestAnimationFrame(tick);
  }

  /* ============================================================
     INTERSECTION OBSERVER — reveal, counters, chart draw
     ============================================================ */
  const revealEls = $$(".section, .fab, .panel, .fact-grid, .param-grid, .timeline, .step-list, .chart-card, .banner-ok, .pillar-grid");
  revealEls.forEach(el => el.classList.add("reveal"));

  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      en.target.classList.add("in-view");
      // counters inside this section
      $$("[data-count]", en.target).forEach(animateCount);
      io.unobserve(en.target);
    });
  }, { threshold: 0.18, rootMargin: "0px 0px -8% 0px" });
  revealEls.forEach(el => io.observe(el));

  // hero counters fire immediately
  $$("#hero [data-count]").forEach(animateCount);

  /* ============================================================
     NAV — scroll spy + burger + smooth close
     ============================================================ */
  const nav = $("#nav");
  const links = $$(".nav__links a");
  const burger = $("#navBurger");
  const navLinks = $("#navLinks");

  burger.addEventListener("click", () => {
    const open = navLinks.classList.toggle("is-open");
    burger.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Tutup menu" : "Buka menu");
  });
  links.forEach(l => l.addEventListener("click", () => {
    navLinks.classList.remove("is-open");
    burger.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
  }));

  const sections = ["ringkasan", "profil", "tujuan", "pendanaan", "proyeksi", "analisis", "risiko", "kesimpulan"]
    .map(id => document.getElementById(id)).filter(Boolean);
  const spy = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        links.forEach(l => l.classList.toggle("is-active", l.getAttribute("href") === "#" + en.target.id));
      }
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  sections.forEach(s => spy.observe(s));

  // shadow on nav when scrolled
  window.addEventListener("scroll", () => {
    nav.style.boxShadow = window.scrollY > 8 ? "0 4px 18px rgba(20,20,20,.08)" : "none";
  }, { passive: true });

})();
