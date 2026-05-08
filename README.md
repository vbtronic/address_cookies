# Browser Cookies

A lightweight, open-source alternative to browser cookies — stores user data directly in the URL address bar using Base64 encoding. No cookie banners, no server required, works on static sites.

Includes **AddressShare**, a companion system for sharing user state between visitors via a single URL.

---

## How it works

Data is encoded as Base64 and stored in the URL hash:

```
https://yoursite.com/page#__bc=BASE64DATA
```

No cookies. No localStorage. No backend. The URL is the storage.

---

## Files

| File | Description |
|---|---|
| `browser-cookies.js` | Main library — no character limit (default) |
| `browser-cookies-limited.js` | Variant with 2000-character URL limit |
| `address-share.js` | AddressShare — share state via URL, no limit |
| `address-share-limited.js` | AddressShare with 2000-character limit |

Use the default (no-limit) versions unless you need compatibility with old proxies or servers that restrict URL length.

---

## Browser Cookies — usage

```html
<script src="browser-cookies.js"></script>
```

```js
// Store and retrieve values
BrowserCookies.set('theme', 'dark');
BrowserCookies.get('theme');           // 'dark'
BrowserCookies.remove('theme');
BrowserCookies.clear();

// Auto-track all inputs on the page (saves and restores on reload)
BrowserCookies.autoTrack();

// Or target specific inputs
BrowserCookies.autoTrack('#myForm input, #myForm textarea');

// Get the current shareable URL
BrowserCookies.getURL();
```

`autoTrack()` reads the current URL on load and restores all tracked input values automatically.

---

## AddressShare — usage

```html
<script src="address-share.js"></script>
```

```js
// Pack data into the current URL and return it
const url = AddressShare.share({ message: 'Hello from the static page' });

// Build a shareable URL without changing the current one
const link = AddressShare.getShareURL({ report: 'Issue #42', status: 'open' });

// On the receiving page — runs callback if shared data is present in URL
AddressShare.onReceive(function (data) {
  console.log(data.message);
});

// Copy shareable URL to clipboard
AddressShare.copyToClipboard({ note: 'Check this out' }).then(function (url) {
  console.log('Copied:', url);
});

// Manually unpack data from any URL string
const data = AddressShare.unpack('https://example.com/#__as=BASE64');
```

---

## Using both together

Both systems use separate keys in the URL hash and do not interfere with each other.

```html
<script src="browser-cookies.js"></script>
<script src="address-share.js"></script>
```

```js
BrowserCookies.autoTrack();

document.getElementById('share-btn').addEventListener('click', function () {
  AddressShare.copyToClipboard({ page: 'contact', ref: 'homepage' });
});
```

Resulting URL: `https://yoursite.com/#__bc=DATA1&__as=DATA2`

---

## License

MIT License — © 2026 Viktor Brunclík

[bruncsoft.com](https://bruncsoft.com) · [vbtronic.com](https://vbtronic.com)
