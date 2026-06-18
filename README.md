# The Royal Authentic Luxury House — website

A static brand site (HTML / CSS / JS, no build step). Apple's structural design
language — full-bleed alternating tiles, low density, a single accent, one shadow —
re-skinned to the House's Sovereign identity (Sovereign Palette, Bodoni + Caslon),
with restrained, crafted motion.

## Structure
- Pages: `index.html`, `the-house.html`, `maisons.html`, `darbar.html`, `solene.html`, `auri.html`
- `css/` — `tokens` · `base` · `components` · `responsive` · `motion`
- `js/main.js` — mobile nav + scroll reveals (progressive-enhancement, `.js`-gated)
- `assets/` — imagery

## Run locally
Serve the folder over HTTP and open the address:

```
python3 -m http.server 8080
# → http://localhost:8080
```

## Notes
- No framework, no dependencies. Fonts load from Google Fonts.
- Motion respects `prefers-reduced-motion`. With JavaScript disabled, all content
  renders (reveals are gated behind a `.js` class).
