(function (global) {
  'use strict';

  var KEY = 'address-share';

  function encode(obj) {
    var bytes = new TextEncoder().encode(JSON.stringify(obj));
    var binary = '';
    bytes.forEach(function (b) { binary += String.fromCharCode(b); });
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  }

  function decode(str) {
    try {
      str = str.replace(/-/g, '+').replace(/_/g, '/');
      while (str.length % 4) str += '=';
      var binary = atob(str);
      var bytes = new Uint8Array(binary.length);
      for (var i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      return JSON.parse(new TextDecoder().decode(bytes));
    } catch (_) {
      return null;
    }
  }

  function hashParams(url) {
    var hash = url ? url.slice(url.indexOf('#') + 1) : location.hash.slice(1);
    return new URLSearchParams(hash);
  }

  var AddressShare = {
    share: function (data) {
      var params = hashParams();
      params.set(KEY, encode(data));
      var newHash = '#' + params.toString();
      history.replaceState(null, '', newHash);
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
      return base + '#' + params.toString();
    },

    onReceive: function (callback) {
      var data = this.unpack();
      if (data !== null) callback(data);
      return this;
    },

    copyToClipboard: function (data) {
      var url = this.getShareURL(data);
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
