# 0005 – Pipeline de imagini cu sharp

**Status:** Acceptat · 2026-09-24

## Context
Cu export static nu avem Image Optimization din Next.js. Imaginile sursă sunt mari (PNG de 2–2,5 MB),
iar coperta e desfășurată (trebuie decupată fața). Performanța mobilă (Lighthouse ≥ 90) depinde de imagini.

## Decizie
- Originalele stau în `media-src/`; `media-src/media.config.ts` definește cheia, decuparea și lățimile.
- `scripts/optimize-images.mjs` (sharp, rulat ca `prebuild`) generează AVIF + WebP la 400/800/1200/1600 px
  (fără upscale) în `public/media/`, un manifest JSON (dimensiuni, căi, blur) și imaginile Open Graph 1200×630.
- Componenta `ResponsiveImage` randează `<picture>` cu `srcset`, `width`/`height` și `loading` corect.

## Consecințe
- **+** Transparent, ~120 de rânduri, fără „magie”; ușor de înțeles și de modificat.
- **+** Imaginile generate nu se commit-uie; build-ul pe Cloudflare le regenerează.
- **−** Build-ul durează puțin mai mult; sharp trebuie să ruleze în mediul de build (are binare pentru Linux).
- **Respins:** `next-image-export-optimizer` (mai opac, dependent de detalii interne `next/image`).

## Cum se schimbă
Se poate trece la un CDN de imagini (Cloudflare Images) sau la `next/image` pe un host cu server,
schimbând doar `ResponsiveImage`.
