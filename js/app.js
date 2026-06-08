/* app.js — router + render semua layar */
(function () {
  "use strict";

  var app = document.getElementById("app");

  /* ---------------- Ikon SVG (stroke 2, viewBox 24) ---------------- */
  var I = {
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    target: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/></svg>',
    book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5a2 2 0 0 1 2-2h10v16H6a2 2 0 0 0-2 2z"/><path d="M16 3h2a2 2 0 0 1 2 2v14a2 2 0 0 0-2-2h-2"/></svg>',
    bolt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 4 14h7l-1 8 9-12h-7z"/></svg>',
    flag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 21V4"/><path d="M5 4h11l-1.5 4L16 12H5"/></svg>',
    arrowR: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>',
    arrowL: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="m11 18-6-6 6-6"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5L20 6"/></svg>',
    bulb: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6"/><path d="M10 21h4"/><path d="M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.2 1 2.5h6c0-1.3.3-1.8 1-2.5A6 6 0 0 0 12 3z"/></svg>',
    share: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4"/></svg>',
    link: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/></svg>',
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 11 9-8 9 8"/><path d="M5 10v10h14V10"/></svg>',
    refresh: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/><path d="M3 21v-5h5"/></svg>',
    grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 5 6v5c0 4 3 7.5 7 9 4-1.5 7-5 7-9V6z"/><path d="m9 12 2 2 4-4"/></svg>'
  };

  var MODES = {
    simulasi: { nama: "Simulasi Ujian", icon: I.clock, desc: "Mirip CAT asli: timer berjalan, soal acak lintas kompetensi, skor & nilai keluar di akhir.", cta: "Mulai Simulasi" },
    latihan: { nama: "Latihan per Kompetensi", icon: I.book, desc: "Pilih satu kompetensi, kerjakan santai, pembahasan langsung muncul tiap soal.", cta: "Mulai Latihan" },
    cepat: { nama: "Acak Cepat", icon: I.bolt, desc: "Drilling cepat: 10/25/50 soal acak dari semua kompetensi.", cta: "Mulai Drilling" }
  };

  var state = { session: null, timer: null, mode: null };

  /* ---------------- util DOM ---------------- */
  function el(html) { var d = document.createElement("div"); d.innerHTML = html.trim(); return d.firstElementChild; }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]; }); }
  function fmtTime(sec) { var m = Math.floor(sec / 60), s = sec % 60; return (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s; }
  function bandOf(p) { return p >= 80 ? { t: "Baik", c: "ok" } : p >= 60 ? { t: "Cukup", c: "mid" } : { t: "Perlu Belajar", c: "low" }; }

  var toastTimer;
  function toast(msg) {
    var t = document.getElementById("toast");
    t.textContent = msg; t.classList.add("show");
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { t.classList.remove("show"); }, 2200);
  }

  function stopTimer() { if (state.timer) { clearInterval(state.timer); state.timer = null; } }

  function setHash(h) {
    if (history.replaceState) history.replaceState(null, "", h || (location.pathname));
    else location.hash = h || "";
  }

  /* ================= LAYAR: BERANDA ================= */
  function renderHome() {
    stopTimer(); state.session = null; setHash("");
    var d = Store.get();
    var best = Store.bestScore();
    var wrong = Store.wrongCount();

    var modeCards = Object.keys(MODES).map(function (m) {
      var x = MODES[m];
      return '<button class="mode-card" data-mode="' + m + '">' +
        '<div class="mode-card__icon">' + x.icon + '</div>' +
        '<h3>' + x.nama + '</h3><p>' + x.desc + '</p>' +
        '<span class="mode-card__cta">' + x.cta + ' ' + I.arrowR + '</span></button>';
    }).join("");

    var statHtml =
      '<div class="grid grid--stats">' +
      '<div class="stat"><div class="stat__num">' + d.totalSesi + '</div><div class="stat__lbl">Sesi Selesai</div></div>' +
      '<div class="stat"><div class="stat__num">' + (best == null ? "–" : best + "%") + '</div><div class="stat__lbl">Skor Terbaik</div></div>' +
      '<div class="stat"><div class="stat__num">' + wrong + '</div><div class="stat__lbl">Soal Perlu Diulang</div></div>' +
      '</div>';

    var ulangiBtn = wrong > 0
      ? '<div class="mt center"><button class="btn btn--ghost" id="ulangi-salah">' + I.refresh + ' Ulangi ' + wrong + ' soal yang pernah salah</button></div>'
      : "";

    app.innerHTML =
      '<div class="screen">' +
      '<div class="hero">' +
      '<span class="hero__badge">' + I.shield + ' Pemetaan Kompetensi ASN 2025 · CACT</span>' +
      '<h1>Latihan Soal CAT Kompetensi ASN</h1>' +
      '<p>Bank soal 6 kompetensi dengan pembahasan. Pilih mode, kerjakan, dan ukur kesiapanmu sebelum ujian.</p>' +
      '</div>' +
      '<div class="section-title">' + I.target + ' Pilih Mode Latihan</div>' +
      '<div class="grid grid--modes">' + modeCards + '</div>' +
      '<div class="section-title">' + I.grid + ' Progresmu</div>' +
      statHtml + ulangiBtn +
      '<p class="muted center mt" style="font-size:.82rem">Skor disimpan lokal di perangkat ini · <a href="#" id="reset-data">Reset data</a></p>' +
      '</div>';

    app.querySelectorAll(".mode-card").forEach(function (b) {
      b.onclick = function () { renderSetup(b.dataset.mode); };
    });
    var us = document.getElementById("ulangi-salah");
    if (us) us.onclick = startUlangiSalah;
    document.getElementById("reset-data").onclick = function (e) {
      e.preventDefault();
      if (confirm("Hapus semua riwayat & data latihan di perangkat ini?")) { Store.reset(); renderHome(); toast("Data direset"); }
    };
  }

  /* ================= LAYAR: SETUP ================= */
  function renderSetup(mode) {
    state.mode = mode;
    Bank.loadManifest().then(function (m) {
      var kompList = m.kompetensi;
      var multi = (mode !== "latihan");
      var defaultSel = multi ? kompList.map(function (k) { return k.id; }) : [kompList[0].id];

      var chips = kompList.map(function (k) {
        var on = defaultSel.indexOf(k.id) >= 0;
        return '<button class="chip" role="' + (multi ? "checkbox" : "radio") + '" aria-pressed="' + on + '" data-k="' + k.id + '">' +
          '<span class="chip__check">' + I.check + '</span>' + esc(k.singkat) + '</button>';
      }).join("");

      var jumlahOpts = mode === "cepat" ? [10, 25, 50] : mode === "latihan" ? [10, 25, 50] : [25, 50, 75, 100];
      var defJumlah = mode === "cepat" ? 25 : mode === "latihan" ? 25 : 50;
      var jumlahChips = jumlahOpts.map(function (n) {
        return '<button class="chip" role="radio" aria-pressed="' + (n === defJumlah) + '" data-jumlah="' + n + '">' + n + ' soal</button>';
      }).join("");

      var timerField = mode === "simulasi"
        ? '<div class="field"><span class="field__label">Timer Ujian</span>' +
          '<div class="toggle-row"><label class="switch"><input type="checkbox" id="timer-toggle" checked><span class="switch__track"></span></label>' +
          '<span class="muted" id="timer-info">Aktif · ±1,5 menit per soal</span></div></div>'
        : "";

      var kompField = mode === "cepat" ? "" :
        '<div class="field"><span class="field__label">' + (multi ? "Kompetensi (boleh pilih beberapa)" : "Pilih Kompetensi") + '</span>' +
        '<div class="chip-row" id="komp-chips">' + chips + '</div></div>';

      app.innerHTML =
        '<div class="screen"><button class="btn btn--subtle btn--sm" id="back-home">' + I.arrowL + ' Beranda</button>' +
        '<div class="card mt">' +
        '<div class="mode-card__icon">' + MODES[mode].icon + '</div>' +
        '<h2>' + MODES[mode].nama + '</h2><p class="muted">' + MODES[mode].desc + '</p>' +
        '<div style="height:8px"></div>' +
        kompField +
        '<div class="field"><span class="field__label">Jumlah Soal</span><div class="chip-row" id="jumlah-chips">' + jumlahChips + '</div>' +
        '<p class="field__hint" id="avail-hint"></p></div>' +
        timerField +
        '<button class="btn btn--primary btn--block" id="start-btn">' + MODES[mode].cta + ' ' + I.arrowR + '</button>' +
        '</div></div>';

      document.getElementById("back-home").onclick = renderHome;

      // chip kompetensi
      var kompChips = app.querySelectorAll("#komp-chips .chip");
      kompChips.forEach(function (c) {
        c.onclick = function () {
          if (multi) { c.setAttribute("aria-pressed", c.getAttribute("aria-pressed") !== "true"); }
          else { kompChips.forEach(function (x) { x.setAttribute("aria-pressed", "false"); }); c.setAttribute("aria-pressed", "true"); }
          updateAvail();
        };
      });
      // chip jumlah (radio)
      var jChips = app.querySelectorAll("#jumlah-chips .chip");
      jChips.forEach(function (c) {
        c.onclick = function () { jChips.forEach(function (x) { x.setAttribute("aria-pressed", "false"); }); c.setAttribute("aria-pressed", "true"); updateAvail(); };
      });

      function selectedKomp() {
        if (mode === "cepat") return kompList.map(function (k) { return k.id; });
        return Array.prototype.filter.call(app.querySelectorAll("#komp-chips .chip"), function (c) {
          return c.getAttribute("aria-pressed") === "true";
        }).map(function (c) { return c.dataset.k; });
      }
      function selectedJumlah() {
        var c = app.querySelector('#jumlah-chips .chip[aria-pressed="true"]');
        return c ? parseInt(c.dataset.jumlah, 10) : defJumlah;
      }
      function updateAvail() {
        var ids = selectedKomp();
        if (!ids.length) { document.getElementById("avail-hint").textContent = "Pilih minimal satu kompetensi."; return; }
        Bank.loadMany(ids).then(function (pool) {
          var want = selectedJumlah();
          document.getElementById("avail-hint").textContent =
            "Tersedia " + pool.length + " soal di pool ini" + (want > pool.length ? " · jumlah disesuaikan jadi " + pool.length : "");
        });
      }
      updateAvail();

      document.getElementById("start-btn").onclick = function () {
        var ids = selectedKomp();
        if (!ids.length) { toast("Pilih minimal satu kompetensi"); return; }
        var jumlah = selectedJumlah();
        var timer = mode === "simulasi" && document.getElementById("timer-toggle").checked;
        startSession({ mode: mode, kompetensiIds: ids, jumlah: jumlah, timer: timer });
      };
    });
  }

  /* ================= MULAI SESI ================= */
  function startSession(cfg) {
    app.innerHTML = '<div class="loader"><div class="spinner"></div>Menyiapkan soal…</div>';
    Bank.loadMany(cfg.kompetensiIds).then(function (pool) {
      cfg.jumlah = Math.min(cfg.jumlah, pool.length);
      cfg.durasiDetik = Math.round(cfg.jumlah * 90);
      state.session = new Session(pool, cfg);
      if (cfg.timer) startTimer();
      renderQuiz();
    });
  }

  function startUlangiSalah() {
    var ids = Store.wrongIds();
    app.innerHTML = '<div class="loader"><div class="spinner"></div>Memuat soal yang pernah salah…</div>';
    Bank.loadAll().then(function (all) {
      var pool = all.filter(function (s) { return ids.indexOf(s.id) >= 0; });
      if (!pool.length) { toast("Tidak ada soal tersimpan"); renderHome(); return; }
      var cfg = { mode: "latihan", kompetensiIds: [], jumlah: pool.length, timer: false };
      state.session = new Session(pool, cfg);
      renderQuiz();
    });
  }

  /* ================= TIMER ================= */
  function startTimer() {
    stopTimer();
    state.timer = setInterval(function () {
      var s = state.session; if (!s) return stopTimer();
      var sisa = s.config.durasiDetik - Math.round((Date.now() - s.mulai) / 1000);
      var elT = document.getElementById("timer");
      if (sisa <= 0) { stopTimer(); finish(); return; }
      if (elT) {
        elT.querySelector("span").textContent = fmtTime(sisa);
        elT.classList.toggle("is-low", sisa <= 60);
      }
    }, 1000);
  }

  /* ================= LAYAR: KUIS ================= */
  function renderQuiz() {
    var s = state.session, soal = s.now(), i = s.current, mode = s.config.mode;
    var praktik = (mode === "latihan");
    var dibuka = praktik && s.terbuka[i];
    var dipilih = s.jawab[i];

    var sisa = s.config.durasiDetik - Math.round((Date.now() - s.mulai) / 1000);
    var timerHtml = s.config.timer
      ? '<div class="timer" id="timer">' + I.clock + '<span>' + fmtTime(Math.max(0, sisa)) + '</span></div>' : "";

    var opsiHtml = soal.opsi.map(function (o, idx) {
      var cls = "option";
      if (dibuka) {
        if (idx === soal.jawaban) cls += " is-correct";
        else if (idx === dipilih) cls += " is-wrong";
      } else if (idx === dipilih) cls += " is-selected";
      return '<button class="' + cls + '" data-opt="' + idx + '"' + (dibuka ? " disabled" : "") + '>' +
        '<span class="option__key">' + "ABCD"[idx] + '</span><span class="option__txt">' + esc(o) + '</span></button>';
    }).join("");

    var explainHtml = "";
    if (dibuka) {
      var benar = dipilih === soal.jawaban;
      explainHtml = '<div class="explain' + (soal.pembahasan ? "" : " explain--empty") + '">' +
        '<div class="explain__title">' + I.bulb + (benar ? " Benar! " : " Kurang tepat · ") + 'Jawaban: ' + "ABCD"[soal.jawaban] + '</div>' +
        (soal.pembahasan ? esc(soal.pembahasan) : "Pembahasan untuk soal ini belum tersedia.") + '</div>';
    }

    var navHtml;
    if (praktik) {
      navHtml = '<div class="quiz-nav">' +
        '<button class="btn btn--subtle" id="prev"' + (i === 0 ? " disabled" : "") + '>' + I.arrowL + ' Sebelumnya</button>' +
        '<span class="spacer"></span>' +
        (i === s.total() - 1
          ? '<button class="btn btn--primary" id="finish">Lihat Hasil ' + I.arrowR + '</button>'
          : '<button class="btn btn--primary" id="next">Berikutnya ' + I.arrowR + '</button>') +
        '</div>';
    } else {
      navHtml = '<div class="quiz-nav">' +
        '<button class="btn btn--subtle" id="prev"' + (i === 0 ? " disabled" : "") + '>' + I.arrowL + ' Sebelumnya</button>' +
        '<button class="flag-btn' + (s.isFlagged(i) ? " is-flagged" : "") + '" id="flag">' + I.flag + (s.isFlagged(i) ? " Ditandai" : " Ragu") + '</button>' +
        '<span class="spacer"></span>' +
        (i === s.total() - 1
          ? '<button class="btn btn--primary" id="toreview">Tinjau Jawaban ' + I.grid + '</button>'
          : '<button class="btn btn--primary" id="next">Berikutnya ' + I.arrowR + '</button>') +
        '</div>';
    }

    var pct = Math.round(((i + 1) / s.total()) * 100);

    app.innerHTML =
      '<div class="screen">' +
      '<div class="quiz-bar">' +
      '<div class="progress"><div class="progress__meta"><span>Soal ' + (i + 1) + ' / ' + s.total() + '</span>' +
      '<span>' + s.countAnswered() + ' terjawab</span></div>' +
      '<div class="progress__bar"><div class="progress__fill" style="width:' + pct + '%"></div></div></div>' +
      timerHtml +
      '</div>' +
      '<div class="card">' +
      '<div class="q-tag">' + esc(Bank.namaKompetensi(soal.kompetensi)) + '</div>' +
      '<div class="q-text">' + esc(soal.q) + '</div>' +
      '<div class="options">' + opsiHtml + '</div>' +
      explainHtml +
      '</div>' + navHtml +
      '<div class="btn-row mt"><button class="btn btn--subtle btn--sm" id="quit">' + I.home + ' Keluar</button></div>' +
      '</div>';

    app.querySelectorAll(".option").forEach(function (b) {
      b.onclick = function () {
        var idx = parseInt(b.dataset.opt, 10);
        s.answer(idx);
        if (praktik) { s.terbuka[i] = true; renderQuiz(); }
        else { renderQuiz(); }
      };
    });
    bind("prev", function () { s.prev(); renderQuiz(); });
    bind("next", function () { s.next(); renderQuiz(); });
    bind("flag", function () { s.toggleFlag(); renderQuiz(); });
    bind("toreview", renderReview);
    bind("finish", finish);
    bind("quit", function () { if (confirm("Keluar dari sesi ini? Progres tidak disimpan.")) renderHome(); });
  }

  function bind(id, fn) { var e = document.getElementById(id); if (e) e.onclick = fn; }

  /* keyboard */
  document.addEventListener("keydown", function (e) {
    if (!state.session || !document.querySelector(".options")) return;
    var s = state.session, i = s.current, mode = s.config.mode, praktik = mode === "latihan";
    var k = e.key.toLowerCase();
    if (["a", "b", "c", "d", "1", "2", "3", "4"].indexOf(k) >= 0) {
      if (praktik && s.terbuka[i]) return;
      var idx = "abcd".indexOf(k); if (idx < 0) idx = parseInt(k, 10) - 1;
      var btn = app.querySelector('.option[data-opt="' + idx + '"]'); if (btn) btn.click();
    } else if (e.key === "ArrowRight") { var n = document.getElementById("next"); if (n) n.click(); }
    else if (e.key === "ArrowLeft") { var p = document.getElementById("prev"); if (p) p.click(); }
    else if (k === "f" && !praktik) { s.toggleFlag(); renderQuiz(); }
  });

  /* ================= LAYAR: TINJAU ================= */
  function renderReview() {
    var s = state.session;
    var cells = s.soal.map(function (_, i) {
      var cls = "qgrid__cell";
      if (s.isAnswered(i)) cls += " answered";
      if (s.isFlagged(i)) cls += " flagged";
      return '<button class="' + cls + '" data-i="' + i + '">' + (i + 1) + '</button>';
    }).join("");
    var belum = s.total() - s.countAnswered();

    app.innerHTML =
      '<div class="screen"><div class="card">' +
      '<h2>' + I.grid + ' Tinjau Jawaban</h2>' +
      '<p class="muted">' + s.countAnswered() + ' terjawab · ' + belum + ' kosong · ' + Object.keys(s.flags).length + ' ditandai. Klik nomor untuk kembali ke soal.</p>' +
      '<div class="legend">' +
      '<span><i style="background:var(--accent-soft);border-color:var(--accent)"></i> Terjawab</span>' +
      '<span><i style="background:var(--surface);border-color:var(--border-strong)"></i> Kosong</span>' +
      '<span><i style="background:var(--flag-soft);border-color:var(--flag)"></i> Ditandai</span>' +
      '</div>' +
      '<div class="qgrid">' + cells + '</div>' +
      '<div class="btn-row btn-row--between mt">' +
      '<button class="btn btn--subtle" id="back-quiz">' + I.arrowL + ' Kembali</button>' +
      '<button class="btn btn--primary" id="submit">Selesai & Lihat Hasil ' + I.check + '</button>' +
      '</div>' + (belum > 0 ? '<p class="field__hint mt">Masih ada ' + belum + ' soal kosong — dihitung salah jika tidak diisi.</p>' : "") +
      '</div></div>';

    app.querySelectorAll(".qgrid__cell").forEach(function (c) {
      c.onclick = function () { s.go(parseInt(c.dataset.i, 10)); renderQuiz(); };
    });
    bind("back-quiz", function () { renderQuiz(); });
    bind("submit", function () { if (confirm("Kumpulkan jawaban dan lihat hasil?")) finish(); });
  }

  /* ================= SELESAI + HASIL ================= */
  function finish() {
    stopTimer();
    var s = state.session;
    var r = s.score();
    var band = bandOf(r.persen);
    r.band = band.t;

    // simpan riwayat + bank salah
    Store.recordSession({
      mode: s.config.mode, tanggal: Date.now(), total: r.total, benar: r.benar,
      persen: r.persen, perKompetensi: r.perKompetensi
    });
    s.soal.forEach(function (soal, i) {
      if (s.jawab[i] !== soal.jawaban) Store.markWrong(soal._src);
      else Store.clearWrong(soal.id);
    });

    renderResult(r, band, s);
  }

  function ringSvg(pct, color) {
    var R = 56, C = 2 * Math.PI * R, off = C * (1 - pct / 100);
    return '<div class="score-ring"><svg width="140" height="140">' +
      '<circle cx="70" cy="70" r="' + R + '" fill="none" stroke="var(--border)" stroke-width="12"/>' +
      '<circle cx="70" cy="70" r="' + R + '" fill="none" stroke="' + color + '" stroke-width="12" stroke-linecap="round" stroke-dasharray="' + C + '" stroke-dashoffset="' + off + '"/>' +
      '</svg><div class="score-ring__center"><div class="score-ring__pct">' + pct + '%</div><div class="score-ring__lbl">benar</div></div></div>';
  }

  function renderResult(r, band, s) {
    var colorMap = { ok: "var(--ok)", mid: "var(--flag)", low: "var(--wrong)" };
    var breakdown = Object.keys(r.perKompetensi).map(function (k) {
      var p = r.perKompetensi[k], pc = Math.round((p.benar / p.total) * 100);
      var bc = bandOf(pc).c;
      return '<div class="bd-row"><div class="bd-row__head"><span class="bd-row__name">' + esc(Bank.namaKompetensi(k)) + '</span>' +
        '<span class="bd-row__val">' + p.benar + '/' + p.total + ' · ' + pc + '%</span></div>' +
        '<div class="bd-bar"><div class="bd-bar__fill" style="width:' + pc + '%;background:' + colorMap[bc] + '"></div></div></div>';
    }).join("");

    var wrong = s.wrongList();
    var wrongHtml = wrong.length ? wrong.map(function (w, n) {
      var so = w.soal;
      var pilih = w.dipilih == null ? "<em>kosong</em>" : "ABCD"[w.dipilih] + ". " + esc(so.opsi[w.dipilih]);
      return '<div class="review-item">' +
        '<div class="review-item__q">' + (n + 1) + '. ' + esc(so.q) + '</div>' +
        '<div class="review-line"><span class="review-line__k tag-wrong">Jawabanmu:</span><span>' + pilih + '</span></div>' +
        '<div class="review-line"><span class="review-line__k tag-correct">Benar:</span><span>' + "ABCD"[so.jawaban] + '. ' + esc(so.opsi[so.jawaban]) + '</span></div>' +
        (so.pembahasan ? '<div class="explain mt"><div class="explain__title">' + I.bulb + ' Pembahasan</div>' + esc(so.pembahasan) + '</div>' : "") +
        '</div>';
    }).join("") : '<p class="muted">Mantap! Tidak ada jawaban yang salah. 🎯</p>';

    app.innerHTML =
      '<div class="screen">' +
      '<div class="card center">' +
      '<h2>Hasil Latihan</h2>' +
      ringSvg(r.persen, colorMap[band.c]) +
      '<div><span class="band band--' + band.c + '">' + band.t + '</span></div>' +
      '<p class="muted mt">' + r.benar + ' benar dari ' + r.total + ' soal · waktu ' + fmtTime(r.durasiDetik) + '</p>' +
      '<p class="field__hint">Skor simulasi latihan, bukan nilai resmi ujian.</p>' +
      '<div class="btn-row btn-row--end" style="justify-content:center">' +
      '<button class="btn btn--primary" id="share">' + I.share + ' Bagikan Hasil</button>' +
      '<button class="btn btn--ghost" id="copylink">' + I.link + ' Salin Link</button>' +
      '</div></div>' +
      '<div class="card"><h3>Rincian per Kompetensi</h3><div class="breakdown mt">' + breakdown + '</div></div>' +
      '<div class="card"><h3>Pembahasan Soal yang Salah (' + wrong.length + ')</h3><div class="mt">' + wrongHtml + '</div></div>' +
      '<div class="btn-row mt" style="justify-content:center">' +
      '<button class="btn btn--primary" id="again">' + I.refresh + ' Ulangi Mode Ini</button>' +
      '<button class="btn btn--subtle" id="tohome">' + I.home + ' Beranda</button>' +
      '</div></div>';

    var payload = { benar: r.benar, total: r.total, persen: r.persen, band: r.band, perKompetensi: r.perKompetensi, mode: s.config.mode };

    bind("share", function () {
      var teks = Share.ringkasanTeks(payload, Bank.namaKompetensi);
      if (navigator.share) {
        navigator.share({ title: "Hasil Latihan CAT", text: teks, url: Share.shareUrl(payload) }).catch(function () {});
      } else {
        Share.copy(teks).then(function () { toast("Ringkasan disalin — tinggal paste ke chat"); });
      }
    });
    bind("copylink", function () {
      Share.copy(Share.shareUrl(payload)).then(function () { toast("Link hasil disalin"); });
    });
    bind("again", function () { renderSetup(s.config.mode); });
    bind("tohome", renderHome);
  }

  /* ================= TAMPILAN HASIL DIBAGIKAN (hash) ================= */
  function renderShared(payload) {
    Bank.loadManifest().then(function () {
      var band = bandOf(payload.persen);
      var colorMap = { ok: "var(--ok)", mid: "var(--flag)", low: "var(--wrong)" };
      var breakdown = payload.perKompetensi ? Object.keys(payload.perKompetensi).map(function (k) {
        var p = payload.perKompetensi[k], pc = Math.round((p.benar / p.total) * 100);
        return '<div class="bd-row"><div class="bd-row__head"><span class="bd-row__name">' + esc(Bank.namaKompetensi(k)) + '</span><span class="bd-row__val">' + p.benar + '/' + p.total + '</span></div><div class="bd-bar"><div class="bd-bar__fill" style="width:' + pc + '%;background:' + colorMap[bandOf(pc).c] + '"></div></div></div>';
      }).join("") : "";
      app.innerHTML =
        '<div class="screen"><div class="card center">' +
        '<span class="hero__badge">' + I.share + ' Hasil dibagikan</span>' +
        '<h2>Hasil Latihan CAT Kompetensi ASN</h2>' +
        ringSvg(payload.persen, colorMap[band.c]) +
        '<div><span class="band band--' + band.c + '">' + band.t + '</span></div>' +
        '<p class="muted mt">' + payload.benar + ' benar dari ' + payload.total + ' soal</p>' +
        (breakdown ? '<div class="breakdown mt" style="text-align:left">' + breakdown + '</div>' : "") +
        '<button class="btn btn--primary btn--block mt" id="start-own">' + I.bolt + ' Coba Latihan Sendiri</button>' +
        '</div></div>';
      bind("start-own", function () { setHash(""); renderHome(); });
    });
  }

  /* ================= INIT ================= */
  document.getElementById("year").textContent = new Date().getFullYear();
  Bank.loadManifest().then(function () {
    var shared = Share.decodeHash();
    if (shared) renderShared(shared); else renderHome();
  }).catch(function () {
    app.innerHTML = '<div class="card center"><h2>Gagal memuat soal</h2><p class="muted">Jalankan lewat server (bukan buka file langsung). Lihat README.</p></div>';
  });

  document.getElementById("brand-btn").onclick = renderHome;
})();
