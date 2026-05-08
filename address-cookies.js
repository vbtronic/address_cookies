(function (global) {
  'use strict';

  var KEY = 'address-cookies';

  function encode(obj) {
    var bytes = new TextEncoder().encode(JSON.stringify(obj));
    var binary = '';
    bytes.forEach(function (b) { binary += String.fromCharCode(b); });
    return btoa(binary);
  }

  function decode(str) {
    try {
      var binary = atob(str);
      var bytes = new Uint8Array(binary.length);
      for (var i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      return JSON.parse(new TextDecoder().decode(bytes));
    } catch (_) {
      return {};
    }
  }

  function hashParams() {
    return new URLSearchParams(location.hash.slice(1));
  }

  var BC = {
    _data: {},

    _load: function () {
      var params = hashParams();
      var raw = params.get(KEY);
      this._data = raw ? decode(raw) : {};
    },

    _save: function () {
      var params = hashParams();
      params.set(KEY, encode(this._data));
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
        var k = '_t_' + id;
        var saved = self.get(k);
        if (el.type === 'checkbox' || el.type === 'radio') {
          if (saved !== undefined) el.checked = saved;
          el.addEventListener('change', function () { self.set(k, el.checked); });
        } else {
          if (saved !== undefined) el.value = saved;
          el.addEventListener('input', function () { self.set(k, el.value); });
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
