/* storage.js — lapisan localStorage: riwayat sesi, bank soal salah, progress */
(function (global) {
  "use strict";

  var KEY = "latihan-cat-v1";

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return defaults();
      var data = JSON.parse(raw);
      if (!data || data.version !== 1) return defaults();
      return data;
    } catch (e) {
      return defaults();
    }
  }

  function defaults() {
    return { version: 1, riwayat: [], salah: {}, totalSesi: 0 };
  }

  function save(data) {
    try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) {}
  }

  var Store = {
    get: function () { return load(); },

    /* Catat hasil sesi. result = {mode, tanggal, total, benar, persen, perKompetensi} */
    recordSession: function (result) {
      var d = load();
      d.totalSesi += 1;
      d.riwayat.unshift(result);
      if (d.riwayat.length > 30) d.riwayat = d.riwayat.slice(0, 30);
      save(d);
    },

    /* Tambah/hapus soal dari bank salah (key = id soal) */
    markWrong: function (soal) {
      var d = load();
      d.salah[soal.id] = { id: soal.id, kompetensi: soal.kompetensi, q: soal.q, ts: Date.now() };
      save(d);
    },
    clearWrong: function (id) {
      var d = load();
      delete d.salah[id];
      save(d);
    },
    wrongIds: function () { return Object.keys(load().salah); },
    wrongCount: function () { return Object.keys(load().salah).length; },

    bestScore: function () {
      var r = load().riwayat;
      if (!r.length) return null;
      return r.reduce(function (m, s) { return Math.max(m, s.persen); }, 0);
    },

    reset: function () { save(defaults()); }
  };

  global.Store = Store;
})(window);
