# Address Cookies

Lehká open-source alternativa k browser cookies — ukládá data uživatele přímo do adresního řádku pomocí Base64 kódování. Žádné cookie bannery, žádný server, funguje na statických stránkách.

Součástí je **AddressShare** — zabal libovolná data do URL, pošli odkaz komukoliv, a když ho otevře, data jsou okamžitě dostupná. Žádný server, žádný backend.

---

## Jak to funguje

Data jsou uložena v URL hashi:

```
https://yoursite.com/page#ac.theme=dark&ac.username=John&as.score=5
```

Žádné cookies. Žádný localStorage. Žádný backend. URL je úložiště. Jednoduché hodnoty (čísla, řetězce, booleany) jsou uloženy jako prostý text — přečteš je přímo v adresním řádku. Složité hodnoty (objekty, pole) jsou uloženy jako Base64.

Limit 2000 znaků (ve variantách `-limited`) platí pro **celkovou délku URL** — origin + cesta + veškerá hash data dohromady.

---

## Soubory

| Soubor | Popis |
|---|---|
| `address-cookies.js` | Hlavní knihovna — bez omezení délky (výchozí) |
| `address-cookies-limited.js` | Varianta s limitem 2000 znaků celkové URL |
| `address-share.js` | AddressShare — data do sdíleného odkazu, bez limitu |
| `address-share-limited.js` | AddressShare s limitem 2000 znaků |

Používej výchozí varianty (bez limitu), pokud nepotřebuješ kompatibilitu se starými proxy nebo servery omezujícími délku URL.

---

## Address Cookies — použití

```html
<script src="address-cookies.js"></script>
```

```js
// Uložení a načtení hodnot
AddressCookies.set('theme', 'dark');
AddressCookies.get('theme');           // 'dark'
AddressCookies.remove('theme');
AddressCookies.clear();

// Automatické sledování všech inputů (ukládá a obnovuje při reload)
AddressCookies.autoTrack();

// Nebo cílení na konkrétní elementy
AddressCookies.autoTrack('#myForm input, #myForm textarea');

// Získání aktuální URL s daty
AddressCookies.getURL();
```

`autoTrack()` přečte URL při načtení stránky a automaticky obnoví všechny sledované hodnoty inputů.

---

## AddressShare — použití

```html
<script src="address-share.js"></script>
```

```js
// Vytvoř sdílitelnou URL bez změny té aktuální
const link = AddressShare.getShareURL({ report: 'Issue #42', status: 'open' });

// Zakóduj data do aktuální URL a vrať ji
const url = AddressShare.share({ message: 'Hello from the static page' });

// Na přijímací stránce — spustí callback pokud URL obsahuje sdílená data
AddressShare.onReceive(function (data) {
  console.log(data.message);
});

// Zkopíruj sdílitelnou URL do schránky
AddressShare.copyToClipboard({ note: 'Check this out' }).then(function (url) {
  console.log('Zkopírováno:', url);
});

// Ručně rozbal data z libovolné URL
const data = AddressShare.unpack('https://example.com/#as.score=5');
```

---

## Použití obou systémů zároveň

Oba systémy ukládají data do URL hashe v oddělených jmenných prostorech (`ac.` pro AddressCookies, `as.` pro AddressShare) a vzájemně si nepřekáží.

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

Výsledná URL: `https://yoursite.com/#ac.page=contact&ac.ref=homepage&as.score=5`

---

## Demo a testy

### Spuštění lokálně

```bash
git clone https://github.com/vbtronic/address_cookies.git
cd address_cookies
```

Otevři v prohlížeči (není potřeba žádný build):

```bash
# Python
python3 -m http.server 8080

# Node.js
npx serve .
```

- Demo: [http://localhost:8080/demo/](http://localhost:8080/demo/)
- Testy: [http://localhost:8080/tests/](http://localhost:8080/tests/)

Soubory lze otevřít i přímo přes `file://` — většina moderních prohlížečů to podporuje bez serveru.

---

## Konzultace, webináře a sponzoring

Potřebuješ pomoc s integrací Address Cookies, stavbou webů bez cookies, nebo chceš webinář? Projekt lze také přímo podpořit.

[opensource.bruncsoft.com](https://opensource.bruncsoft.com)

---

## Licence

MIT Licence — © 2026 Viktor Brunclík

[bruncsoft.com](https://bruncsoft.com) · [vbtronic.com](https://vbtronic.com)
