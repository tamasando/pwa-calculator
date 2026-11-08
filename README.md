# Számológép PWA

Magyar nyelvű, mobilra optimalizált számológép.

## Funkciók

- Összeadás, kivonás, szorzás, osztás
- Tizedesvessző, százalék, előjelváltás
- AC és visszatörlés, billentyűzet-támogatás
- Mobilon telepíthető, első sikeres betöltés után offline is működik

## GitHub Pages aktiválása

1. Nyisd meg: https://github.com/tamasando/pwa-calculator/settings/pages
2. **Build and deployment → Source:** Deploy from a branch
3. **Branch:** main, **Folder:** /(root) → Save
4. A közzététel után a nyilvános cím: https://tamasando.github.io/pwa-calculator/

A Pages HTTPS-t használ. Androidon Chrome-ban válaszd a **Telepítés** vagy **Hozzáadás a kezdőképernyőhöz** opciót.

## Helyi futtatás

```bash
python -m http.server 8000
```

A böngészőben: http://localhost:8000

A service worker csak HTTPS vagy localhost alatt működik. Új alkalmazásverziónál a `sw.js`-ben növelni kell a `CACHE_NAME` verzióját.
