# AGENTS.md — Address Cookies

Instructions for AI agents working on this project.

## Project overview

Address Cookies is a JavaScript library that replaces browser cookies by encoding user data as Base64 and storing it in the URL hash. AddressShare is a companion library for sharing state between users via URL.

## File structure

```
address-cookies.js          — main library, no URL length limit (default)
address-cookies-limited.js  — same API, enforces 2000-character total URL limit
address-share.js            — AddressShare library, no limit
address-share-limited.js    — AddressShare with 2000-character total URL limit
demo/index.html             — demo site: math quiz + AddressShare sharing
tests/index.html            — browser-based test suite (auto-runs on open)
LICENSE                     — MIT 2026 Viktor Brunclík
README.md                   — public documentation
AGENTS.md                   — this file
```

## Architecture

- Data is stored in the URL hash (`#`) as URLSearchParams
- AddressCookies uses the key `address-cookies`, AddressShare uses `address-share`
- Both can coexist in the same hash: `#address-cookies=DATA&address-share=DATA`
- Encoding: UTF-8 bytes → Base64 (`TextEncoder` in default versions)
- Limited versions use `encodeURIComponent` + `btoa` for broader compatibility

## URL length limit

The 2000-character limit in the `-limited` variants applies to the **full URL** — `origin + pathname + search + hash` combined. This matches the effective limit of old browsers (IE) and restrictive HTTP proxies. Modern browsers have no meaningful URL limit; the default (no-limit) versions are recommended.

## Conventions

- No external dependencies — vanilla JS only, no build step
- Each library file is a self-contained IIFE that attaches one global (`AddressCookies` or `AddressShare`)
- Default versions target modern browsers (TextEncoder, URLSearchParams, history.replaceState)
- No transpilation, no bundler — files are used directly via `<script src="...">`

## Simplification logic (limited versions)

When the encoded URL would exceed 2000 characters, `address-cookies-limited.js` removes autoTracked input values (keys prefixed `_t_`) one by one until the URL fits. Custom values set via `.set()` are preserved. If still over limit after removing all tracked inputs, the save is skipped and `_save()` returns `false`.

## Naming

- Main library: **Address Cookies** (`AddressCookies` global)
- Companion library: **AddressShare** (`AddressShare` global)

## License

MIT 2026 — do not change the license or copyright holder.
