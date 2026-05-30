# Address Cookies

Lightweight open-source alternative to browser cookies — stores user data directly in the URL address bar. No cookie banners, no server required, works on static sites.

Includes built-in sharing: pack any data into a URL, send the link to anyone, and when they open it the data is instantly available on their end. No server, no backend.

---

## How it works

Data is stored in the URL hash as readable key-value pairs:

```
https://yoursite.com/page#ac.theme=dark&ac.username=John&as.score=5
```

- `ac.` — your own data (Address Cookies)
- `as.` — data packed for sharing (share)

Simple values (numbers, strings, booleans) are stored as plain text — readable directly in the address bar. Complex values (objects, arrays) are stored as Base64.

The 2000-character limit (in `address-cookies-limited.js`) applies to the **total URL length** — origin + path + all hash data combined.

---

## Files

| File | Description |
|---|---|
| `address-cookies.js` | Full library — no character limit (default) |
| `address-cookies-limited.js` | Variant with 2000-character total URL limit |

Use the default (no-limit) version unless you need compatibility with old proxies or servers that restrict URL length.

---

## Usage

```html
<script src="address-cookies.js"></script>
```

### Store and retrieve your own data

```js
AddressCookies.set('theme', 'dark');
AddressCookies.get('theme');           // 'dark'
AddressCookies.remove('theme');
AddressCookies.clear();

// Auto-track all inputs (saves and restores on reload)
AddressCookies.autoTrack();

// Or target specific elements
AddressCookies.autoTrack('#myForm input, #myForm textarea');

// Get the current URL
AddressCookies.getURL();
```

`autoTrack()` reads the current URL on load and restores all tracked input values automatically.

### Share data via link

```js
// Build a shareable URL — does NOT change the current page URL
// Without baseURL: includes any existing ac. data from the current URL
const link = AddressCookies.getShareURL({ score: 5, result: 'pass' });

// For a different target page (clean URL, no ac. data carried over)
const link2 = AddressCookies.getShareURL({ score: 5 }, 'https://example.com/results');

// Copy shareable URL to clipboard (does NOT change the current page URL)
AddressCookies.copyToClipboard({ score: 5 }).then(function (url) {
  console.log('Copied:', url);
});

// On the receiving page — runs callback if shared data is present in URL
AddressCookies.onReceive(function (data) {
  console.log(data.score);
});

// Update the current URL with shared data (changes the address bar)
AddressCookies.share({ score: 5 });

// Manually unpack shared data from any URL string
const data = AddressCookies.unpack('https://example.com/#as.score=5');
```

---

## Demo & tests

- **Practical demo:** [github.com/vbtronic/address_cookies_practical_demo](https://github.com/vbtronic/address_cookies_practical_demo)

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

**Project page:** [bruncsoft.com/address-cookies](https://bruncsoft.com/address-cookies)

---

## License

MIT License — © 2026 Viktor Brunclík

[bruncsoft.com](https://bruncsoft.com) · [vbtronic.com](https://vbtronic.com)
