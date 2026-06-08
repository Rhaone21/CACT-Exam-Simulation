/* quiz.js — bank soal + engine sesi (seleksi, acak, skor, flag) */
(function (global) {
  "use strict";

  /* ---------- util acak ---------- */
  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  /* ---------- Bank: muat & cache data kompetensi ---------- */
  var Bank = {
    manifest: null,
    _cache: {},

    loadManifest: function () {
      if (Bank.manifest) return Promise.resolve(Bank.manifest);
      return fetch("data/index.json")
        .then(function (r) { return r.json(); })
        .then(function (m) { Bank.manifest = m; return m; });
    },

    loadKompetensi: function (id) {
      if (Bank._cache[id]) return Promise.resolve(Bank._cache[id]);
      var meta = Bank.manifest.kompetensi.find(function (k) { return k.id === id; });
      return fetch("data/" + meta.file)
        .then(function (r) { return r.json(); })
        .then(function (list) { Bank._cache[id] = list; return list; });
    },

    /* muat beberapa kompetensi sekaligus -> array soal tergabung */
    loadMany: function (ids) {
      return Promise.all(ids.map(Bank.loadKompetensi)).then(function (lists) {
        return lists.reduce(function (acc, l) { return acc.concat(l); }, []);
      });
    },

    loadAll: function () {
      return Bank.loadManifest().then(function (m) {
        return Bank.loadMany(m.kompetensi.map(function (k) { return k.id; }));
      });
    },

    namaKompetensi: function (id) {
      var k = Bank.manifest.kompetensi.find(function (x) { return x.id === id; });
      return k ? k.nama : id;
    }
  };

  /* ---------- siapkan soal: acak urutan opsi, petakan jawaban ---------- */
  function prepare(soal) {
    var idx = shuffle([0, 1, 2, 3]);
    var opsi = idx.map(function (i) { return soal.opsi[i]; });
    var jawaban = idx.indexOf(soal.jawaban);
    return {
      id: soal.id,
      kompetensi: soal.kompetensi,
      q: soal.q,
      opsi: opsi,
      jawaban: jawaban,
      pembahasan: soal.pembahasan || "",
      _src: soal
    };
  }

  /* ---------- Session ----------
     config: { mode, kompetensiIds[], jumlah, timer(bool), durasiDetik } */
  function Session(soalPool, config) {
    var picked = shuffle(soalPool).slice(0, config.jumlah);
    this.config = config;
    this.soal = picked.map(prepare);
    this.jawab = {};     // idxSoal -> idxOpsi
    this.flags = {};     // idxSoal -> true
    this.terbuka = {};   // idxSoal -> true (sudah dibuka pembahasan, mode latihan)
    this.current = 0;
    this.selesai = false;
    this.mulai = Date.now();
  }

  Session.prototype.total = function () { return this.soal.length; };
  Session.prototype.now = function () { return this.soal[this.current]; };
  Session.prototype.answer = function (idxOpsi) { this.jawab[this.current] = idxOpsi; };
  Session.prototype.isAnswered = function (i) { return this.jawab[i] != null; };
  Session.prototype.countAnswered = function () { return Object.keys(this.jawab).length; };
  Session.prototype.toggleFlag = function () {
    if (this.flags[this.current]) delete this.flags[this.current];
    else this.flags[this.current] = true;
  };
  Session.prototype.isFlagged = function (i) { return !!this.flags[i]; };
  Session.prototype.go = function (i) {
    this.current = Math.max(0, Math.min(this.total() - 1, i));
  };
  Session.prototype.next = function () { if (this.current < this.total() - 1) this.current++; };
  Session.prototype.prev = function () { if (this.current > 0) this.current--; };

  /* skor + breakdown per kompetensi */
  Session.prototype.score = function () {
    var benar = 0, perK = {};
    this.soal.forEach(function (s, i) {
      var k = s.kompetensi;
      if (!perK[k]) perK[k] = { benar: 0, total: 0 };
      perK[k].total++;
      if (this.jawab[i] === s.jawaban) { benar++; perK[k].benar++; }
    }, this);
    var total = this.total();
    return {
      benar: benar,
      total: total,
      persen: total ? Math.round((benar / total) * 100) : 0,
      perKompetensi: perK,
      durasiDetik: Math.round((Date.now() - this.mulai) / 1000)
    };
  };

  Session.prototype.wrongList = function () {
    var out = [];
    this.soal.forEach(function (s, i) {
      if (this.jawab[i] !== s.jawaban) out.push({ soal: s, dipilih: this.jawab[i] });
    }, this);
    return out;
  };

  global.Bank = Bank;
  global.Session = Session;
  global.shuffleArr = shuffle;
})(window);
