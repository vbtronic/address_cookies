(function (global) {
  'use strict';

  var KEY = '__bc';
  var MAX = 2000;

  function encode(obj) {
    return btoa(encodeURIComponent(JSON.stringify(obj)));
  }

  function decode(str) {
    try {
      return JSON.parse(decodeURIComponent(atob(str)));
    } catch (_) {
      return {};
    }
  }

  function hashParams() {
    return new URLSearchParams(location.hash.slice(1));
  }

  function urlWith(params) {
    return location.href.split('#')[0] + '#' + params.toString();
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
      var data = this._data;

      params.set(KEY, encode(data));
      if (urlWith(params).length <= MAX) {
        history.replaceState(null, '', '#' + params.toString());
        return true;
      }

      var simplified = JSON.parse(JSON.stringify(data));
      var tracked = Object.keys(simplified).filter(function (k) {
        return k.indexOf('_t_') === 0;
      });

      while (tracked.length > 0) {
        delete simplified[tracked.pop()];
        params.set(KEY, encode(simplified));
        if (urlWith(params).length <= MAX) {
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
