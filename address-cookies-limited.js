(function (global) {
  'use strict';

  var AC  = 'ac.';
  var AS  = 'as.';
  var MAX = 2000;

  function toB64(obj) {
    return btoa(encodeURIComponent(JSON.stringify(obj))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  }

  function fromB64(str) {
    str = str.replace(/-/g, '+').replace(/_/g, '/');
    while (str.length % 4) str += '=';
    return JSON.parse(decodeURIComponent(atob(str)));
  }

  function encodeVal(val) {
    if (val === null)            return 'null';
    if (val === true)            return 'true';
    if (val === false)           return 'false';
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

  function hashParams(url) {
    var hash = url ? url.slice((url.indexOf('#') + 1) || url.length) : location.hash.slice(1);
    return new URLSearchParams(hash);
  }

  function clearNS(params, ns) {
    var toRemove = [];
    params.forEach(function (_, k) { if (k.indexOf(ns) === 0) toRemove.push(k); });
    toRemove.forEach(function (k) { params.delete(k); });
  }

  function writeNS(params, ns, data) {
    Object.keys(data).forEach(function (k) { params.set(ns + k, encodeVal(data[k])); });
  }

  function readNS(params, ns) {
    var data = {}, found = false;
    params.forEach(function (val, k) {
      if (k.indexOf(ns) === 0) { data[k.slice(ns.length)] = decodeVal(val); found = true; }
    });
    return found ? data : null;
  }

  function fullURL(params) {
    return location.href.split('#')[0] + '#' + params.toString();
  }

  var AddressCookies = {
    _data: {},
    _autoTracked: [],

    _load: function () {
      var result = readNS(hashParams(), AC);
      this._data = result || {};
    },

    _buildParams: function (data) {
      var params = hashParams();
      clearNS(params, AC);
      writeNS(params, AC, data);
      return params;
    },

    _save: function () {
      var params = this._buildParams(this._data);
      if (fullURL(params).length <= MAX) {
        history.replaceState(null, '', '#' + params.toString());
        return true;
      }
      var simplified = JSON.parse(JSON.stringify(this._data));
      var tracked = this._autoTracked.slice().reverse();
      for (var i = 0; i < tracked.length; i++) {
        delete simplified[tracked[i]];
        params = this._buildParams(simplified);
        if (fullURL(params).length <= MAX) {
          history.replaceState(null, '', '#' + params.toString());
          return true;
        }
      }
      return false;
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
    },

    // ── Share ──────────────────────────────────────────────────────────

    share: function (data) {
      var params = hashParams();
      clearNS(params, AS);
      writeNS(params, AS, data);
      if (fullURL(params).length > MAX) return false;
      history.replaceState(null, '', '#' + params.toString());
      return location.href;
    },

    getShareURL: function (data, baseURL) {
      var base, params;
      if (baseURL) {
        base   = baseURL.split('#')[0];
        params = new URLSearchParams();
      } else {
        base   = location.href.split('#')[0];
        params = hashParams();
        clearNS(params, AS);
      }
      writeNS(params, AS, data);
      var url = base + '#' + params.toString();
      return url.length <= MAX ? url : null;
    },

    onReceive: function (callback) {
      var data = readNS(hashParams(), AS);
      if (data !== null) callback(data);
      return this;
    },

    unpack: function (url) {
      return readNS(hashParams(url), AS);
    },

    copyToClipboard: function (data) {
      var url = this.getShareURL(data);
      if (!url) return Promise.reject(new Error('Data exceeds 2000 character URL limit'));
      if (navigator.clipboard) {
        return navigator.clipboard.writeText(url).then(function () { return url; });
      }
      var ta = document.createElement('textarea');
      ta.value = url;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      return Promise.resolve(url);
    }
  };

  AddressCookies._load();
  global.AddressCookies = AddressCookies;

})(window);
