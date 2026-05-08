(function (global) {
  'use strict';

  var NS = 'as.';

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

  function writeData(data, baseParams) {
    var params = baseParams || new URLSearchParams();
    Object.keys(data).forEach(function (k) { params.set(NS + k, encodeVal(data[k])); });
    return params;
  }

  function readData(params) {
    var data = {};
    var found = false;
    params.forEach(function (val, key) {
      if (key.indexOf(NS) === 0) { data[key.slice(NS.length)] = decodeVal(val); found = true; }
    });
    return found ? data : null;
  }

  function clearNS(params) {
    var toRemove = [];
    params.forEach(function (_, key) { if (key.indexOf(NS) === 0) toRemove.push(key); });
    toRemove.forEach(function (k) { params.delete(k); });
  }

  var AddressShare = {
    share: function (data) {
      var params = hashParams();
      clearNS(params);
      writeData(data, params);
      history.replaceState(null, '', '#' + params.toString());
      return location.href;
    },

    unpack: function (url) {
      return readData(hashParams(url));
    },

    getShareURL: function (data, baseURL) {
      var base, params;
      if (baseURL) {
        base   = baseURL.split('#')[0];
        params = new URLSearchParams();
      } else {
        base   = location.href.split('#')[0];
        params = hashParams();
        clearNS(params);
      }
      writeData(data, params);
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
