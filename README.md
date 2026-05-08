# Address Cookies

Lightweight open-source alternative to browser cookies — stores user data directly in the URL address bar using Base64 encoding. No cookie banners, no server required, works on static sites.

Includes **AddressShare** — pack any data into a URL, send the link to anyone, and when they open it the data is instantly available on their end. No server, no backend.

---

## How it works

Data is encoded as Base64 and stored in the URL hash:

```
https://yoursite.com/page#ac.theme=dark&ac.username=John&as.score=5
```

No cookies. No localStorage. No backend. The URL is the storage. Simple values (numbers, strings, booleans) are stored as plain text — you can read them directly in the address bar. Complex values (objects, arrays) are stored as Base64.

The 2000-character limit (in the `-limited` variants) applies to the **total URL length** — origin + path + all hash data combined.

---

## Files

| File | Description |
|---|---|
| `address-cookies.js` | Main library — no character limit (default) |
| `address-cookies-limited.js` | Variant with 2000-character total URL limit |
| `address-share.js` | AddressShare — encode data into a shareable link, no limit |
| `address-share-limited.js` | AddressShare with 2000-character total URL limit |

Use the default (no-limit) versions unless you need compatibility with old proxies or servers that restrict URL length.

---

## Address Cookies — usage

```html
<script src="address-cookies.js"></script>
```

```js
// Store and retrieve values
AddressCookies.set('theme', 'dark');
AddressCookies.get('theme');           // 'dark'
AddressCookies.remove('theme');
AddressCookies.clear();

// Auto-track all inputs (saves and restores on reload)
AddressCookies.autoTrack();

// Or target specific elements
AddressCookies.autoTrack('#myForm input, #myForm textarea');

// Get the current shareable URL
AddressCookies.getURL();
```

`autoTrack()` reads the current URL on load and restores all tracked input values automatically.

---

## AddressShare — usage

AddressShare works standalone — no AddressCookies required.

```html
<script src="address-share.js"></script>
```

```js
// Build a shareable URL — does NOT change the current page URL
// Without baseURL: includes any existing ac. data from the current URL
const link = AddressShare.getShareURL({ report: 'Issue #42', status: 'open' });

// For a different target page (clean URL, no ac. data carried over)
const link2 = AddressShare.getShareURL({ report: 'Issue #42' }, 'https://example.com/report');

// Update the current URL with shared data (changes the address bar)
const url = AddressShare.share({ message: 'Hello from the static page' });

// On the receiving page — runs callback if shared data is present in URL
AddressShare.onReceive(function (data) {
  console.log(data.message);
});

// Copy shareable URL to clipboard (does NOT change the current page URL)
AddressShare.copyToClipboard({ note: 'Check this out' }).then(function (url) {
  console.log('Copied:', url);
});

// Manually unpack data from any URL string
const data = AddressShare.unpack('https://example.com/#as.note=hello');
```

---

## Using both together

Both systems store data in the URL hash under separate namespaces (`ac.` for AddressCookies, `as.` for AddressShare) and do not interfere with each other.

```html
<script src="address-cookies.js"></script>
<script src="address-share.js"></script>
```

```js
AddressCookies.autoTrack();

document.getElementById('share-btn').addEventListener('click', function () {
  AddressShare.copyToClipboard({ page: 'contact', ref: 'homepage' });
});
```

Resulting URL: `https://yoursite.com/#ac.page=contact&ac.ref=homepage&as.score=5`

---

## Demo & tests

### Run locally

```bash
git clone https://github.com/vbtronic/address_cookies.git
cd address_cookies
```

Then open in a browser (no build step needed):

```bash
# Python
python3 -m http.server 8080

# Node.js
npx serve .
```

- Demo: [http://localhost:8080/demo/](http://localhost:8080/demo/)
- Tests: [http://localhost:8080/tests/](http://localhost:8080/tests/)

You can also open the files directly via `file://` — most browsers support this without a server.

---

## Consulting, webinars & sponsoring

Need help integrating Address Cookies, building cookie-free static sites, or want a deep-dive webinar? You can also support the project directly.

[opensource.bruncsoft.com](https://opensource.bruncsoft.com)

---

## License

MIT License — © 2026 Viktor Brunclík

[bruncsoft.com](https://bruncsoft.com) · [vbtronic.com](https://vbtronic.com)
