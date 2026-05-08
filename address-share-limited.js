(function (global) {
  'use strict';

  var KEY = '__as';
  var MAX = 2000;

  function encode(obj) {
    return btoa(encodeURIComponent(JSON.stringify(obj)));
  }

  function decode(str) {
    try {
      return JSON.parse(decodeURIComponent(atob(str)));
    } catch (_) {
      return null;
    }
  }

  function hashParams(url) {
    var hash = url ? url.slice(url.indexOf('#') + 1) : location.hash.slice(1);
    return new URLSearchParams(hash);
  }

  function buildURL(base, params) {
    return base + '#' + params.toString();
  }

  var AddressShare = {
    share: function (data) {
      var base = location.href.split('#')[0];
      var params = hashParams();
      params.set(KEY, encode(data));
      var url = buildURL(base, params);
      if (url.length > MAX) return false;
      history.replaceState(null, '', '#' + params.toString());
      return location.href;
    },

    unpack: function (url) {
      var params = hashParams(url);
      var raw = params.get(KEY);
      return raw ? decode(raw) : null;
    },

    getShareURL: function (data, baseURL) {
      var base = (baseURL || location.href).split('#')[0];
      var params = new URLSearchParams();
      params.set(KEY, encode(data));
      var url = buildURL(base, params);
      return url.length <= MAX ? url : null;
    },

    onReceive: function (callback) {
      var data = this.unpack();
      if (data !== null) callback(data);
      return this;
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

  global.AddressShare = AddressShare;

})(window);
