/* share.js — encode hasil ke URL hash + salin ringkasan teks */
(function (global) {
  "use strict";

  function encodeResult(payload) {
    try {
      var json = JSON.stringify(payload);
      return "#hasil=" + encodeURIComponent(btoa(unescape(encodeURIComponent(json))));
    } catch (e) { return ""; }
  }

  function decodeHash() {
    var h = location.hash || "";
    var m = h.match(/#hasil=([^&]+)/);
    if (!m) return null;
    try {
      var json = decodeURIComponent(escape(atob(decodeURIComponent(m[1]))));
      return JSON.parse(json);
    } catch (e) { return null; }
  }

  function shareUrl(payload) {
    return location.origin + location.pathname + encodeResult(payload);
  }

  function ringkasanTeks(r, namaFn) {
    var lines = [];
    lines.push("Hasil Latihan CAT Kompetensi ASN");
    lines.push("Skor: " + r.benar + "/" + r.total + " (" + r.persen + "%) — " + r.band);
    if (r.perKompetensi) {
      Object.keys(r.perKompetensi).forEach(function (k) {
        var p = r.perKompetensi[k];
        lines.push("• " + (namaFn ? namaFn(k) : k) + ": " + p.benar + "/" + p.total);
      });
    }
    lines.push("Coba juga: " + location.origin + location.pathname);
    return lines.join("\n");
  }

  function copy(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      try {
        var ta = document.createElement("textarea");
        ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
        document.body.appendChild(ta); ta.focus(); ta.select();
        document.execCommand("copy"); document.body.removeChild(ta); resolve();
      } catch (e) { reject(e); }
    });
  }

  global.Share = {
    encodeResult: encodeResult,
    decodeHash: decodeHash,
    shareUrl: shareUrl,
    ringkasanTeks: ringkasanTeks,
    copy: copy
  };
})(window);
