# Font sources

Variable fonts from [google/fonts](https://github.com/google/fonts), licensed under the
SIL Open Font License 1.1 (see the `OFL-*.txt` files), which allows subsetting for the web.

- `CormorantGaramond-VF.ttf`, `CormorantGaramond-Italic-VF.ttf` – headings, menu (wght 300–700)
- `DMSans-VF.ttf` – body text (opsz 9–40, wght 100–1000)

`npm run fonts` (also run before dev/build) keeps only the characters the site uses and
writes small WOFF2 files to `src/generated/fonts/`. When adding a language with new
characters (e.g. French œ, German ß), add them to `scripts/subset-fonts.ts`.
Arabic/Hindi need different font families altogether (see docs/PLAN.md §12d).
