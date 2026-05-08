(function (global) {
  'use strict';

  var NS = 'ac.';

  function toB64(obj) {
    var bytes = new TextEncoder().encode(JSON.stringify(obj));
    var bin = '';
    bytes.forEach(function (b) { bin += String.fromCharCode(b); });
    return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  }

  function fromB64(str) {
    str = str.replace(/-/g, '+').replace(/_/g, '/');
    while (str.length % 4) str += '=';
    var bin = atob(str);
    var bytes = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return JSON.parse(new TextDecoder().decode(bytes));
  }

  function encodeVal(val) {
    if (val === null)           return 'null';
    if (val === true)           return 'true';
    if (val === false)          return 'false';
    if (typeof val !== 'object') return String(val);
    return '*' + toB64(val);
  }

  function decodeVal(str) {
    if (str === 'null')  return null;
    if (str === 'true')  return true;
    if (str === 'false') return false;
    if (str.charAt(0) === '*') { try { return fromB64(str.slice(1)); } catch (_) { return null; } }
    var n = Number(str);
    return str !== '' && !isNaN(n) ? n : str;
  }

  function hashParams() {
    return new URLSearchParams(location.hash.slice(1));
  }

  var BC = {
    _data: {},
    _autoTracked: [],

    _load: function () {
      var params = hashParams();
      var data = {};
      params.forEach(function (val, key) {
        if (key.indexOf(NS) === 0) data[key.slice(NS.length)] = decodeVal(val);
      });
      this._data = data;
    },

    _save: function () {
      var params = hashParams();
      var self = this;
      var toRemove = [];
      params.forEach(function (_, key) { if (key.indexOf(NS) === 0) toRemove.push(key); });
      toRemove.forEach(function (k) { params.delete(k); });
      Object.keys(this._data).forEach(function (k) { params.set(NS + k, encodeVal(self._data[k])); });
      history.replaceState(null, '', '#' + params.toString());
    },

    set: function (key, value) {
      this._data[key] = value;
      this._save();
      return this;
    },

    get: function (key, fallback) {
      return key in this._data ? this._data[key] : fallback;
    },

    remove: function (key) {
      delete this._data[key];
      this._save();
      return this;
    },

    clear: function () {
      this._data = {};
      this._save();
      return this;
    },

    all: function () {
      return JSON.parse(JSON.stringify(this._data));
    },

    autoTrack: function (selector) {
      var self = this;
      selector = selector || 'input, textarea, select';
      document.querySelectorAll(selector).forEach(function (el) {
        var id = el.id || el.name;
        if (!id) return;
        self._autoTracked.push(id);
        var saved = self.get(id);
        if (el.type === 'checkbox' || el.type === 'radio') {
          if (saved !== undefined) el.checked = saved;
          el.addEventListener('change', function () { self.set(id, el.checked); });
        } else {
          if (saved !== undefined) el.value = saved;
          el.addEventListener('input', function () { self.set(id, el.value); });
        }
      });
      return this;
    },

    getURL: function () {
      return location.href;
    }
  };

  BC._load();
  global.AddressCookies = BC;

})(window);
